import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { notFound } from 'remix-utils'
import invariant from 'tiny-invariant'

import { requireAuth } from '~/lib/utils.server'
import type { ThingBase } from '~/models/thing.server'
import { getThing } from '~/models/thing.server'

type LoaderData = {
  thing: ThingBase
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = await requireAuth(request)
  const thingId = params.thingId
  invariant(thingId, 'thingId not found')

  const thing = await getThing(thingId, userId)
  if (!thing) throw notFound('thing not found')

  return json<LoaderData>({ thing })
}

const ThingShow = () => {
  const { thing } = useLoaderData() as LoaderData

  return (
    <div className="prose mx-auto">
      <h1>{thing.name}</h1>
      <p>{thing.description}</p>
    </div>
  )
}
export default ThingShow
