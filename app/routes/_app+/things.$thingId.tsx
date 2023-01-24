import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { notFound } from 'remix-utils'
import invariant from 'tiny-invariant'

import { requireAuth } from '~/lib/utils.server'
import { getThing } from '~/resources/thing.server'

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireAuth(request)
  const thingId = params.thingId
  invariant(thingId, 'thingId not found')

  const thing = await getThing(thingId, user.id)
  if (!thing) throw notFound('thing not found')

  return json({ thing })
}

const ThingShow = () => {
  const { thing } = useLoaderData<typeof loader>()

  return (
    <div className="prose mx-auto">
      <h1>{thing.name}</h1>
      <p>{thing.createdAt}</p>
    </div>
  )
}
export default ThingShow
