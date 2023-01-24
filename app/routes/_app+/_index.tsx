import { useEffect } from 'react'
import type { ActionFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import toast from 'react-hot-toast'
import { notFound } from 'remix-utils'

import ThingCard from '~/components/ThingCard'
import { APP_ROUTES } from '~/lib/constants'
import { requireAuth, requireHttpPost } from '~/lib/utils.server'
import { deleteThing, getThings } from '~/resources/thing.server'

export const action: ActionFunction = async ({ request }) => {
  requireHttpPost(request)
  const user = await requireAuth(request)
  const thingId = (await request.formData()).get('thingId')
  if (!thingId) throw notFound({ thingId })

  try {
    await deleteThing(thingId.toString(), user.id)
    return json({ ok: true })
  } catch (error) {
    return json({ error: (error as Error).message })
  }
}

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuth(request)
  const things = await getThings(user.id)
  return json({ things })
}

const AppIndex = () => {
  const { things } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()

  useEffect(() => {
    if (fetcher.state !== 'idle' || fetcher.type !== 'done') return
    if (fetcher.data.ok) {
      toast.success('Thing successfuly deleted.')
    } else {
      toast.error(`Trouble deleting thing: ${fetcher.data.error}`)
    }
  }, [fetcher.state, fetcher.type, fetcher.data])

  const handleDelete = (thingId: string) => () => {
    fetcher.submit({ thingId }, { method: 'post' })
  }

  if (!things || things.length < 1)
    return (
      <div className="mx-auto flex h-full w-full flex-col items-center justify-center space-y-2">
        <h2>No things yet</h2>
        <Link
          id="create-thing"
          className="btn-primary btn"
          to={APP_ROUTES.NEW_THING}
        >
          Create a thing!
        </Link>
      </div>
    )

  return (
    <div className="mx-auto grid grid-cols-4 justify-center gap-7 md:grid-cols-6">
      <ThingCard />

      {things.map((th) => (
        <ThingCard key={th.id} thing={th} onDelete={handleDelete(th.id)} />
      ))}
    </div>
  )
}

export default AppIndex
