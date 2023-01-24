import type { MetaFunction } from '@remix-run/node'

import { requireEnv } from './utils'

export const APP_NAME = 'Remix Chop Suey Stack'

export const APP_ROUTES = {
  // Auth
  LOGIN: '/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  RESET_PASSWORD_CONFIRM: '/reset-password/confirm',
  // App
  HOME: '/',
  NEW_THING: '/things/new',
  SHOW_THING: (id: string) => `/things/${id}`,
} as const

/** The base URL for the server (e.g. http://localhost:3000)
 *
 * **NOTE**: no trailing `/`
 */
export const SERVER_URL = (
  typeof document === 'object'
    ? window.location.origin
    : requireEnv('SERVER_URL')
).replace(/\/$/, '')

/**
 * Change the top-level DaisyUI theme
 * @see https://daisyui.com/docs/themes
 */
export const APP_THEME = 'autumn'

/** The default meta tags for the app */
export const DEFAULT_META: ReturnType<MetaFunction> = {
  title: APP_NAME,
  charSet: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
}
