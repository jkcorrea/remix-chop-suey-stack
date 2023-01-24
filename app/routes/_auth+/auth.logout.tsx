import type { ActionArgs } from '@remix-run/node'

import { APP_ROUTES } from '~/lib/constants'
import { requireHttpDelete } from '~/lib/utils.server'
import { authenticator } from '~/services/auth'

export async function action({ request }: ActionArgs) {
  requireHttpDelete(request)
  await authenticator.logout(request, { redirectTo: APP_ROUTES.HOME })
}
