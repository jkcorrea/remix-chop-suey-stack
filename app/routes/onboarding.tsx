import { useEffect, useMemo, useRef } from 'react'
import { users } from '@clerk/remix/api.server'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import { getFormData, useFormInputProps } from 'remix-params-helper'
import { z } from 'zod'

import { classNames } from '~/lib/utils'
import { requireAuth, requireHttpPost } from '~/lib/utils.server'
import { createProfile, getProfileByUserId } from '~/models/profile.server'

const FormSchema = z.object({
  alias: z.string().min(3, 'alias-too-short').max(20, 'alias-too-long'),
})

type ActionData = {
  errors?: Partial<Record<keyof typeof FormSchema['shape'], string>>
}

export const action: ActionFunction = async ({ request }) => {
  requireHttpPost(request)
  const { userId } = await requireAuth(request)

  const formValidation = await getFormData(request, FormSchema)

  if (!formValidation.success) {
    return json<ActionData>({ errors: formValidation.errors })
  }

  const { alias } = formValidation.data
  await createProfile({ alias, userId })

  return redirect('/')
}

interface LoaderData {
  name?: string | null
}

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await requireAuth(request)
  const profile = await getProfileByUserId(userId)

  if (profile) return redirect('/')

  const user = await users.getUser(userId)

  return json<LoaderData>({ name: user.firstName })
}

const OnboardingPage = () => {
  const { name } = useLoaderData() as LoaderData
  const actionData = useActionData()
  const inputProps = useFormInputProps(FormSchema)
  const aliasRef = useRef<HTMLInputElement>(null)
  const transition = useTransition()
  const disabled =
    transition.state === 'submitting' || transition.state === 'loading'

  const errors = useMemo(() => ({ ...actionData?.errors }), [actionData])
  useEffect(() => {
    if (errors.alias) aliasRef.current?.focus()
  }, [errors])

  return (
    <main className="container mx-auto flex h-screen items-center justify-center">
      <Form method="post" className="flex flex-col gap-8">
        <div>
          <h1>Welcome{name ? `, ${name}!` : '!'}</h1>
          <p className="text-gray-700">
            Please choose an alias to get started.
          </p>
        </div>

        <p className="form-control">
          <input
            {...inputProps('alias')}
            ref={aliasRef}
            placeholder="McUser69"
            name="alias"
            className={classNames(
              'input input-bordered',
              errors.alias && 'border-error'
            )}
            {...(errors.alias
              ? { 'aria-invalid': true, 'aria-errormessage': errors.alias }
              : undefined)}
            disabled={disabled}
          />

          {errors.alias && (
            <label className="label">
              <span className="label-text-alt text-error" id="name-error">
                {errors.alias}
              </span>
            </label>
          )}
        </p>

        <p className="flex w-full justify-between">
          <Link to="/" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={disabled}>
            Create
          </button>
        </p>
      </Form>
    </main>
  )
}

export default OnboardingPage
