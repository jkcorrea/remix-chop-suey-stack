import React from 'react'
import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { getFormData, useFormInputProps } from 'remix-params-helper'
import { z } from 'zod'

import { classNames } from '~/lib/utils'
import { requireAuth, requireHttpPost } from '~/lib/utils.server'
import { createThing } from '~/models/thing.server'

const FormSchema = z.object({
  name: z.string().min(3, 'name-too-short').max(20, 'name-too-long'),
  description: z.string().min(3, 'description-too-short'),
})

type ActionData = {
  errors?: Partial<Record<keyof typeof FormSchema['shape'], string>>
}

export const action: ActionFunction = async ({ request }) => {
  requireHttpPost(request)
  const { userId } = await requireAuth(request)

  const formValidation = await getFormData(request, FormSchema)

  if (!formValidation.success) {
    return json<ActionData>({
      errors: formValidation.errors,
    })
  }

  const { name, description } = formValidation.data
  const { id } = await createThing({ name, description }, userId)

  return redirect(`/${id}`)
}

const BaseNew = () => {
  const actionData = useActionData() as ActionData
  const nameRef = React.useRef<HTMLInputElement>(null)
  const descriptionRef = React.useRef<HTMLInputElement>(null)
  const inputProps = useFormInputProps(FormSchema)
  const transition = useTransition()
  const disabled =
    transition.state === 'submitting' || transition.state === 'loading'

  const errors = React.useMemo(() => ({ ...actionData?.errors }), [actionData])
  React.useEffect(() => {
    if (errors.name) nameRef.current?.focus()
    else if (errors.description) descriptionRef.current?.focus()
  }, [errors])

  return (
    <Form method="post" className="mx-auto flex w-full max-w-sm flex-col gap-8">
      <h1>New Base</h1>

      <p className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
          {/* <span className="hint label-text-alt">REQ</span> */}
        </label>

        <input
          {...inputProps('name')}
          ref={nameRef}
          name="name"
          className={classNames(
            'input input-bordered',
            errors.name && 'border-error'
          )}
          {...(errors.name
            ? { 'aria-invalid': true, 'aria-errormessage': errors.name }
            : undefined)}
          disabled={disabled}
        />

        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error" id="name-error">
              {errors.name}
            </span>
          </label>
        )}
      </p>

      <p className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>

        <input
          {...inputProps('description')}
          ref={descriptionRef}
          name="description"
          className={classNames(
            'input input-bordered',
            errors.description && 'border-error'
          )}
          {...(errors.description
            ? { 'aria-invalid': true, 'aria-errormessage': errors.description }
            : undefined)}
          disabled={disabled}
        />

        {errors.description && (
          <label className="label">
            <span className="label-text-alt text-error" id="project-ref-error">
              {errors.description}
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
  )
}

export default BaseNew
