import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import { BsEnvelope } from 'react-icons/bs'
import { createCustomIssues, parseForm, useZorm } from 'react-zorm'
import { z } from 'zod'

import { TextField } from '~/components/forms'
import { APP_ROUTES, SERVER_URL } from '~/lib/constants'
import { tw } from '~/lib/tw'
import { getUserByEmail } from '~/resources/user.server'
import { commitSession, getSession } from '~/services/auth'
import { decrypt, encrypt } from '~/services/auth/encryption.server'
import { sendResetPassword } from '~/services/email/send-reset-password.server'

const FormSchema = z.object({
  email: z.string().email(),
})

export default function ResetPassword() {
  const { hasEmailSent } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const { state } = useTransition()
  const isSubmitting = state === 'submitting'
  const zo = useZorm('register', FormSchema, {
    customIssues: actionData?.serverIssues,
  })

  return (
    <div className="flex w-full flex-col">
      <p className="mb-2 text-base-content/70">
        In order to set a new password, we'll first have to email you a password
        reset link.
      </p>
      <Form ref={zo.ref} method="post" className="flex w-full flex-col">
        <fieldset className="mb-2 space-y-3">
          <TextField
            type="email"
            label="Email"
            name={zo.fields.email()}
            error={zo.errors.email()?.message}
          />
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting || hasEmailSent}
          className={tw('btn-primary btn mt-4', isSubmitting && 'loading')}
        >
          <BsEnvelope className="absolute left-6 h-6 w-6" />
          <span>{hasEmailSent ? 'Email Sent!' : 'Request Password'}</span>
        </button>
      </Form>

      <div className="mt-2 flex w-full flex-row justify-between space-x-2">
        <Link
          to={APP_ROUTES.LOGIN}
          prefetch="intent"
          className="link-hover link-primary link"
        >
          Log In
        </Link>
        <Link
          to={APP_ROUTES.REGISTER}
          prefetch="intent"
          className="link-hover link-primary link"
        >
          Create an account
        </Link>
      </div>
    </div>
  )
}

const TOKEN_PARAM_KEY = 'token'
const EMAIL_SENT_SESSION_KEY = 'email-sent'
export const RESET_PASSWORD_SESSION_KEY = 'reset-password'

const TokenSchema = z.object({
  type: z.literal('reset-password'),
  payload: z.object({
    email: z.string().email(),
  }),
})

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const hasEmailSent = session.get(EMAIL_SENT_SESSION_KEY) || false
  const resetPasswordToken = new URL(request.url).searchParams.get(
    TOKEN_PARAM_KEY
  )

  if (resetPasswordToken) {
    const parsed = TokenSchema.safeParse(
      JSON.parse(decrypt(resetPasswordToken))
    )
    if (!parsed.success) throw redirect(APP_ROUTES.LOGIN)
    const { email } = parsed.data.payload

    session.set(RESET_PASSWORD_SESSION_KEY, email)

    // Redirects committing newly updated Session.
    throw redirect(APP_ROUTES.RESET_PASSWORD_CONFIRM, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  }

  return json({ hasEmailSent })
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const { email } = parseForm(FormSchema, formData)
  const issues = createCustomIssues(FormSchema)
  const session = await getSession(request.headers.get('Cookie'))
  // Checks for user existence in database.
  const dbUser = await getUserByEmail(email)

  if (dbUser?.email) {
    // Encrypt `email` into a token.
    const data: z.infer<typeof TokenSchema> = {
      type: 'reset-password',
      payload: { email },
    }
    const token = encrypt(JSON.stringify(data))
    // Create a URL with `token` param
    const url = new URL(`${SERVER_URL}${APP_ROUTES.RESET_PASSWORD}`)
    url.searchParams.set(TOKEN_PARAM_KEY, token)
    // Sends user an email with newly created URL
    await sendResetPassword(dbUser.email, url)
    // Notify the UI that the email was sent.
    session.flash(EMAIL_SENT_SESSION_KEY, true)
  } else {
    issues.email('Email not found.')
  }

  // Sends submission state back to the client.
  return json({ serverIssues: issues.toArray() })
}
