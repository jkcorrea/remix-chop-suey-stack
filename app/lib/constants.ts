import type { MetaFunction } from '@remix-run/node'

export const APP_NAME = 'Remix Chop Suey Stack'

export const APP_THEME = 'autumn'

export const LOGIN_ROUTE = '/login'
export const HOME_ROUTE = '/'

export const DEFAULT_META: ReturnType<MetaFunction> = {
  title: APP_NAME,
  charSet: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
}
