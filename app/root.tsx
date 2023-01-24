import React from 'react'
import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import type { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

import { APP_THEME, DEFAULT_META } from '~/lib/constants'
import RouteChangeAnnouncement from '~/lib/RouteChangeAnnouncement'

import tailwindStylesheetUrl from '~/styles/tailwind.css'

export const meta: MetaFunction = () => DEFAULT_META

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: '//fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: tailwindStylesheetUrl },
]

const App = () => (
  <Document>
    <Outlet />
  </Document>
)

export default App

const Document = ({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) => {
  const data = useLoaderData()
  // const matches = useMatches()
  // const useWhenSomethingIsTrue = matches.some(match => match.handle && match.handle?.something)

  return (
    <html lang="en" data-theme={APP_THEME} className="bg-base-100">
      <head>
        <title>{title || 'Remix Chop Suey Stack'}</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />

        <RouteChangeAnnouncement />

        <ScrollRestoration />

        {data && data.ENV && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
        )}

        <Scripts />

        <LiveReload />
      </body>
    </html>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  let title = 'Error!'
  let errorMessage: ReactNode = error instanceof Error ? error.message : null

  if (isRouteErrorResponse(error)) {
    title = `${error.status}: ${error.statusText}`
    switch (error.status) {
      case 401:
        errorMessage =
          'Oops! Looks like you tried to visit a page that you do not have access to.'
        break
      case 404:
        errorMessage =
          'Oops! Looks like you tried to visit a page that does not exist.'
        break
    }
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{errorMessage}</p>
      <hr />
      <p>
        Hey, developer, you should replace this with what you want your users to
        see.
      </p>
    </div>
  )
}
