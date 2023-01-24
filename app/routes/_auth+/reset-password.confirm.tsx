import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { parseForm, useZorm } from 'react-zorm'
import { z } from 'zod'

import { TextField } from '~/components/forms'
import { APP_ROUTES } from '~/lib/constants'
import { tw } from '~/lib/tw'
import { getUserByEmail, updateUserPassword } from '~/resources/user.server'
import { hashPassword } from '~/services/auth/encryption.server'
import { commitSession, getSession } from '~/services/auth/session.server'

import { RESET_PASSWORD_SESSION_KEY } from './reset-password'

const FormSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match.',
    path: ['confirmPassword'],
  })

export default function ResetPasswordConfirm() {
  const actionData = useActionData<typeof action>()
  const { state } = useTransition()
  const isSubmitting = state === 'submitting'
  const zo = useZorm('register', FormSchema, {
    customIssues: actionData?.serverIssues,
  })

  return (
    <div className="flex w-full flex-col">
      <Form method="post" autoComplete="off">
        <fieldset>
          <TextField
            type="password"
            label="New Password"
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
          className={tw('btn-primary btn', isSubmitting && 'loading')}
        >
          <span>Reset Password</span>
        </button>
      </Form>

      <div className="mt-4 flex flex-row justify-end">
        <Link
          to="/login"
          prefetch="intent"
          className="font-semibold text-violet-200 hover:opacity-80"
        >
          Already have an account?
        </Link>
      </div>
    </div>
  )
}

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const email = session.get(RESET_PASSWORD_SESSION_KEY)
  if (!email) throw redirect(APP_ROUTES.LOGIN)

  return json({
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export async function action({ request }: ActionArgs) {
  let password: string
  try {
    const formData = await request.formData()
    password = parseForm(FormSchema, formData).password
  } catch (e) {
    if (e instanceof z.ZodError) {
      return json({
        serverIssues: e.issues.map((iss) => ({
          code: 'custom' as const,
          message: iss.message,
          path: iss.path,
        })),
      })
    } else throw e
  }

  // Gets values from Session.
  const session = await getSession(request.headers.get('Cookie'))

  const email = session.get(RESET_PASSWORD_SESSION_KEY)
  if (!email) throw redirect(APP_ROUTES.LOGIN)

  // Checks for user existence in database.
  const dbUser = await getUserByEmail(email)
  if (!dbUser?.email || !dbUser?.passwordHash) throw redirect(APP_ROUTES.LOGIN)

  // Hash & update new password
  const hashedPassword = await hashPassword(password)
  await updateUserPassword(email, hashedPassword)
  session.unset(RESET_PASSWORD_SESSION_KEY)

  // Redirects committing newly updated Session.
  throw redirect(APP_ROUTES.LOGIN, {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}
