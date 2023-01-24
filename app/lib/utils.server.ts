import type { MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { authenticator } from '~/services/auth'

import { APP_ROUTES, DEFAULT_META } from './constants'

/** Combines default meta tags with a page subtitle & any custom meta tags for a page */
export const makeMetaFn =
  (subtitle?: string, overrides?: ReturnType<MetaFunction>): MetaFunction =>
  () => ({
    ...DEFAULT_META,
    title: `${DEFAULT_META.title}${subtitle ? ` | ${subtitle}` : ''}`,
    ...overrides,
  })

/**
 * Require auth for a route. Throws & redirects to /login if not logged in.
 *
 * @param request The incoming request to authenticate
 * @returns The auth object, if authenticated
 * @throws redirects to login if unauthenticated
 */
export const requireAuth = async (request: Request) => {
  const auth = await authenticator.isAuthenticated(request)
  if (!auth) throw redirect(APP_ROUTES.LOGIN, 302)
  return auth
}

export const requireHttpMethod = (verb: string) => (request: Request) => {
  if (request.method !== verb)
    throw new Response('Method not allowed', { status: 405 })
}

export const requireHttpPost = requireHttpMethod('POST')
export const requireHttpDelete = requireHttpMethod('DELETE')
