import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react'
import type { ActionArgs, LoaderArgs } from '@remix-run/server-runtime'
import { json, redirect } from '@remix-run/server-runtime'
import { sentenceCase } from 'change-case'
import type { IconType } from 'react-icons'
import {
  BsDiscord,
  BsFacebook,
  BsGithub,
  BsGoogle,
  BsMicrosoft,
  BsTwitter,
} from 'react-icons/bs'
import { useZorm } from 'react-zorm'
import type { ZodCustomIssueWithMessage } from 'react-zorm/dist/types'
import type { SocialsProvider } from 'remix-auth-socials'
import { z } from 'zod'

import { TextField } from '~/components/forms'
import { APP_ROUTES } from '~/lib/constants'
import { tw } from '~/lib/tw'
import {
  AUTH_CONTEXT,
  authenticator,
  AuthFormLoginSchema,
} from '~/services/auth'
import { enabledStrategies } from '~/services/auth/auth.server'
import { commitSession, getSession } from '~/services/auth/session.server'

const SocialsData: Record<
  keyof typeof SocialsProvider,
  { className: string; Icon: IconType }
> = {
  DISCORD: {
    className: 'bg-[#7289da]',
    Icon: BsDiscord,
  },
  FACEBOOK: {
    className: 'bg-[#3b5998]',
    Icon: BsFacebook,
  },
  GITHUB: {
    className: 'bg-[#2b3137]',
    Icon: BsGithub,
  },
  GOOGLE: {
    className: 'bg-[#4285f4]',
    Icon: BsGoogle,
  },
  MICROSOFT: {
    className: 'bg-[#2f2f2f]',
    Icon: BsMicrosoft,
  },
  TWITTER: {
    className: 'bg-[#1da1f2]',
    Icon: BsTwitter,
  },
}

export default function LoginIndex() {
  const actionData = useActionData<typeof action>()
  const { strategies } = useLoaderData<typeof loader>()
  const { state } = useTransition()
  const isSubmitting = state === 'submitting'
  const zo = useZorm('register', AuthFormLoginSchema, {
    customIssues: actionData?.serverIssues,
  })

  return (
    <div className="flex w-full flex-col">
      {strategies.length > 0 && (
        <>
          <div className="flex w-full flex-col space-y-0.5">
            {Object.entries(SocialsData)
              .filter(([provider]) => strategies.includes(provider))
              .map(([provider, { className, Icon }]) => (
                <Form
                  key={provider}
                  method="post"
                  action={`/auth/${provider.toLowerCase()}`}
                >
                  <button className={tw('btn h-12 w-full', className)}>
                    <Icon className="absolute left-6 h-6 w-6 fill-white" />
                    <span>Continue with {sentenceCase(provider)}</span>
                  </button>
                </Form>
              ))}
          </div>

          <div className="divider">OR</div>
        </>
      )}

      <div className="flex w-full flex-col">
        <Form ref={zo.ref} method="post" className="flex w-full flex-col">
          <fieldset className="mb-2 space-y-3">
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
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            className={tw('btn-primary btn mt-4', isSubmitting && 'loading')}
          >
            <span>Sign In</span>
          </button>
        </Form>

        <div className="mt-2 flex w-full flex-row justify-between space-x-2">
          <Link
            to={APP_ROUTES.RESET_PASSWORD}
            prefetch="intent"
            className="link-hover link-primary link"
          >
            Forgot password
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
    </div>
  )
}

export async function loader({ request }: LoaderArgs) {
  if (await authenticator.isAuthenticated(request))
    throw redirect(APP_ROUTES.HOME)
  return json({ strategies: enabledStrategies })
}

export async function action({ request }: ActionArgs) {
  let serverIssues: ZodCustomIssueWithMessage[]

  try {
    const user = await authenticator.authenticate('form', request, {
      context: { action: AUTH_CONTEXT.LOGIN },
    })
    // Sets newly created user on Session
    const session = await getSession(request.headers.get('cookie'))
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
