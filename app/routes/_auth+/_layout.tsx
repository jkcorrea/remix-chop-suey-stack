import { useMemo } from 'react'
import type { DataFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLocation } from '@remix-run/react'

import { APP_ROUTES } from '~/lib/constants'
import { authenticator } from '~/services/auth'

export async function loader({ request }: DataFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: APP_ROUTES.HOME,
  })

  return json({})
}

export default function AuthLayout() {
  const location = useLocation()

  const subtitle = useMemo(() => {
    switch (location.pathname) {
      case APP_ROUTES.REGISTER:
        return 'Create a new account'
      case APP_ROUTES.RESET_PASSWORD:
        return 'Forgot your password?'
      case APP_ROUTES.RESET_PASSWORD_CONFIRM:
        return 'Reset your password'
      case APP_ROUTES.LOGIN:
        return 'Log in'
      default:
        return null
    }
  }, [location.pathname])

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex h-full w-full flex-col justify-center rounded-xl bg-white p-8 shadow-lg md:h-auto md:max-w-md">
        <div className="mb-3">
          {location && location.pathname === APP_ROUTES.LOGIN && (
            <h5 className="text-3xl font-bold text-base-content">
              Welcome back
            </h5>
          )}
          {subtitle && (
            <h5 className="text-2xl font-semibold text-base-content/80">
              {subtitle}
            </h5>
          )}
        </div>

        <Outlet />
      </div>
    </div>
  )
}
