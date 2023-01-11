import React from 'react'
import { ClerkApp, ClerkCatchBoundary } from '@clerk/remix'
import { rootAuthLoader } from '@clerk/remix/ssr.server'
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
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

export const loader: LoaderFunction = async (args) =>
  rootAuthLoader(args, ({ request }) => ({ ENV: {} }))

/**
 * The root module's default export is a component that renders the current
 * route via the `<Outlet />` component. Think of this as the global layout
 * component for your app.
 */
const App = () => (
  <Document>
    <Layout>
      <Outlet />
    </Layout>
  </Document>
)

export default ClerkApp(App)

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
    <html lang="en" data-theme={APP_THEME}>
      <head>
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

const Layout = ({ children }: { children: ReactNode }) => (
  <div id="remix-root">{children}</div>
)

export const CatchBoundary = ClerkCatchBoundary(() => {
  const caught = useCatch()

  let message
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      )
      break
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      )
      break
    default:
      throw new Error(caught.data || caught.statusText)
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  )
})

export const ErrorBoundary = ({ error }: { error: Error }) => (
  <Document title="Error!">
    <Layout>
      <div>
        <h1>There was an error</h1>
        <p>{error.message}</p>
        <hr />
        <p>
          Hey, developer, you should replace this with what you want your users
          to see.
        </p>
      </div>
    </Layout>
  </Document>
)
