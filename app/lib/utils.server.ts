import { getAuth } from '@clerk/remix/ssr.server'
import type { ServerGetToken } from '@clerk/types/src/ssr'
import type { MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'

import { DEFAULT_META } from './constants'

/** Combines default meta tags with a page subtitle & any custom meta tags for a page */
export const makeMetaFn =
  (subtitle?: string, overrides?: ReturnType<MetaFunction>): MetaFunction =>
  () => ({
    ...DEFAULT_META,
    title: `${DEFAULT_META.title}${subtitle ? ` | ${subtitle}` : ''}`,
    ...overrides,
  })

export type ServerSideAuthNonNull = {
  sessionId: string
  userId: string
  getToken: ServerGetToken
}

/**
 * Require auth for a route. Throws & redirects if not logged in.
 *
 * @param request The incoming request to authenticate
 * @returns The auth object, if authenticated
 * @throws redirects to login if unauthenticated
 */
export const requireAuth = async (
  request: Request
): Promise<ServerSideAuthNonNull> => {
  const auth = await getAuth(request)
  try {
    invariant(auth.userId)
    invariant(auth.sessionId)
    return auth as ServerSideAuthNonNull
  } catch {
    throw redirect('/login', 302)
  }
}

export const requireHttpVerb = (verb: string) => (request: Request) => {
  if (request.method !== verb)
    throw new Response('Method not allowed', { status: 405 })
}

export const requireHttpPost = requireHttpVerb('POST')
