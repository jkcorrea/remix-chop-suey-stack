import type { DataFunctionArgs } from '@remix-run/node'

import { APP_ROUTES } from '~/lib/constants'
import { authenticator } from '~/services/auth'

export async function action({ request, params }: DataFunctionArgs) {
  if (typeof params.provider !== 'string') throw new Error('Invalid provider.')

  return await authenticator.authenticate(params.provider, request, {
    successRedirect: APP_ROUTES.HOME,
    failureRedirect: APP_ROUTES.LOGIN,
  })
}
