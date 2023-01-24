import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react'
import { BsPersonCircle } from 'react-icons/bs'

import { APP_NAME, APP_ROUTES } from '~/lib/constants'
import { requireAuth } from '~/lib/utils.server'

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuth(request)

  return json({ user })
}

const AppLayout = () => {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="absolute inset-0 max-h-screen overflow-hidden">
      <header className="relative z-10 border-b border-base-content shadow-md">
        <div className="container navbar mx-auto">
          <div className="navbar-start">
            <Link to=".">
              <h1 className="text-3xl font-bold">{APP_NAME}</h1>
            </Link>
          </div>
          <div className="navbar-end space-x-3">
            {/* User dropdown */}
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                <div className="w-10 rounded-full">
                  {user.avatar ? (
                    <img alt="avatar" src={user.avatar} />
                  ) : (
                    <BsPersonCircle className="h-8 w-8" />
                  )}
                </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
              >
                <p className="mb-4 w-full text-center font-bold">
                  Hello, {user.name}!
                </p>

                <li>
                  <Form method="delete" action={APP_ROUTES.LOGOUT}>
                    <button className="text-error">Logout</button>
                  </Form>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main className="container relative mx-auto flex space-x-4 px-5 pt-12 md:px-0">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
