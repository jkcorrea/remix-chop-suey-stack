import { UserButton } from '@clerk/remix'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'

import type { Profile } from '~/db/types'
import { APP_NAME } from '~/lib/constants'
import { requireAuth } from '~/lib/utils.server'
import { getProfileByUserId } from '~/models/profile.server'

interface LoaderData {
  profile: Partial<Profile>
}

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await requireAuth(request)
  const profile = await getProfileByUserId(userId)

  if (!profile) return redirect('/onboarding')

  return json<LoaderData>({ profile })
}

const AppLayout = () => {
  const { profile } = useLoaderData() as LoaderData

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
            <p>{profile.alias}</p>
            <UserButton />
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
