import type { ActionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { useZorm } from 'react-zorm'
import type { ZodCustomIssueWithMessage } from 'react-zorm/dist/types'
import { z } from 'zod'

import { TextField } from '~/components/forms'
import { APP_ROUTES } from '~/lib/constants'
import { tw } from '~/lib/tw'
import {
  AUTH_CONTEXT,
  authenticator,
  AuthFormRegisterSchema,
} from '~/services/auth'
import { commitSession, getSession } from '~/services/auth/session.server'

export default function AuthRegister() {
  const actionData = useActionData<typeof action>()
  const { state } = useTransition()
  const isSubmitting = state === 'submitting'
  const zo = useZorm('register', AuthFormRegisterSchema, {
    customIssues: actionData?.serverIssues,
  })

  return (
    <div className="flex w-full flex-col">
      <Form ref={zo.ref} method="post" className="flex w-full flex-col">
        <fieldset className="mb-2 space-y-3">
          <TextField
            label="Name"
            name={zo.fields.name()}
            error={zo.errors.name()?.message}
          />
          <TextField
            label="Email"
            name={zo.fields.email()}
            error={zo.errors.email()?.message}
          />
          <TextField
            type="password"
            label="Password"
            name={zo.fields.password()}
            error={zo.errors.password()?.message}
          />
          <TextField
            type="password"
            label="Confirm Password"
            name={zo.fields.confirmPassword()}
            error={zo.errors.confirmPassword()?.message}
          />
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          className={tw('btn-primary btn mt-4', isSubmitting && 'loading')}
        >
          <span>Sign Up</span>
        </button>
      </Form>

      <div className="mt-2 flex w-full flex-row justify-center">
        <Link
          to={APP_ROUTES.LOGIN}
          prefetch="intent"
          className="link-hover link-primary link"
        >
          Already have an account?
        </Link>
      </div>
    </div>
  )
}

export async function action({ request }: ActionArgs) {
  let serverIssues: ZodCustomIssueWithMessage[]

  try {
    const user = await authenticator.authenticate('form', request, {
      context: { action: AUTH_CONTEXT.REGISTER },
    })
    const session = await getSession(request.headers.get('Cookie'))
    session.set(authenticator.sessionKey, user)

    // Redirect & commit newly updated Session
    throw redirect(APP_ROUTES.HOME, {
      headers: { 'Set-Cookie': await commitSession(session) },
    })
  } catch (e) {
    if (e instanceof z.ZodError) {
      serverIssues = e.issues.map((iss) => ({
        code: 'custom',
        message: iss.message,
        path: iss.path,
      }))
    } else throw e
  }

  return json({ serverIssues }, { status: 422 })
}
