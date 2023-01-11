import { db } from '~/db'
import e from '~/db/edgeql'
import type { Thing } from '~/db/types'

export type ThingBase = Pick<Thing, 'id' | 'name' | 'description'>
export type CreateThing = Pick<Thing, 'name' | 'description'>

// TODO: checking thing.owner.userId against the current user should
// be done at the EdgeDB level when RBAC is implemented (in 2.0)

export const getThings = async (userId: string): Promise<ThingBase[]> =>
  e
    .select(e.Thing, (th) => ({
      id: true,
      name: true,
      // filter for things owned by current user
      filter: e.op(th.owner.userId, '=', userId),
    }))
    .run(db)

export const getThing = async (
  thingId: string,
  userId: string
): Promise<ThingBase | null> =>
  e
    .select(e.Thing, (th) => ({
      id: true,
      name: true,
      description: true,
      filter: e.all(
        e.set(
          e.op(th.id, '=', e.uuid(thingId)),
          e.op(th.owner.userId, '=', userId)
        )
      ),
    }))
    .assert_single()

    .run(db)

export const createThing = async (th: CreateThing, userId: string) =>
  e
    .insert(e.Thing, {
      ...th,
      owner: e.select(e.Profile, (p) => ({
        filter_single: e.op(p.userId, '=', userId),
      })),
    })
    .run(db)

export const deleteThing = async (
  thingId: string,
  userId: string
): Promise<unknown> =>
  e
    .delete(e.Thing, (th) => ({
      filter: e.all(
        e.set(
          // Find by UUID
          e.op(th.id, '=', e.uuid(thingId)),
          // Making sure user owns this thing
          e.op(th.owner.userId, '=', userId)
        )
      ),
    }))
    .run(db)
