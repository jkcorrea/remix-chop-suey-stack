import React from 'react'
import type { ActionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { safeParseForm, useZorm } from 'react-zorm'
import type { ZodCustomIssueWithMessage } from 'react-zorm/dist/types'
import { z } from 'zod'

import { TextField } from '~/components/forms'
import { APP_ROUTES } from '~/lib/constants'
import { requireAuth, requireHttpPost } from '~/lib/utils.server'
import { createThing } from '~/resources/thing.server'

const FormSchema = z.object({
  name: z.string().min(3, 'name-too-short').max(20, 'name-too-long'),
  description: z
    .string()
    .min(3, 'description-too-short')
    .max(100, 'description-too-long'),
})

export const action = async ({ request }: ActionArgs) => {
  requireHttpPost(request)
  const user = await requireAuth(request)
  const formData = await request.formData()
  const res = safeParseForm(FormSchema, formData)

  if (!res.success) {
    return json(
      {
        serverIssues: res.error.issues as ZodCustomIssueWithMessage[],
      },
      { status: 422 }
    )
  }

  const { name, description } = res.data
  const { id } = await createThing({ name, description }, user.id)
  throw redirect(APP_ROUTES.SHOW_THING(id))
}

const ThingNew = () => {
  const actionData = useActionData<typeof action>()
  const zo = useZorm('create-thing', FormSchema, {
    customIssues: actionData?.serverIssues,
  })
  const transition = useTransition()
  const disabled =
    transition.state === 'submitting' || transition.state === 'loading'

  return (
    <Form
      ref={zo.ref}
      method="post"
      className="mx-auto flex w-full max-w-sm flex-col gap-8"
    >
      <h1>New Thing</h1>

      <fieldset className="mb-2 space-y-3">
        <TextField
          label="Name"
          name={zo.fields.name()}
          error={zo.errors.name()?.message}
        />
        <TextField
          label="Description"
          name={zo.fields.description()}
          error={zo.errors.description()?.message}
        />
      </fieldset>

      <p className="flex w-full justify-between">
        <Link to="/" className="btn-outline btn">
          Cancel
        </Link>
        <button type="submit" className="btn-primary btn" disabled={disabled}>
          Create
        </button>
      </p>
    </Form>
  )
}

export default ThingNew
