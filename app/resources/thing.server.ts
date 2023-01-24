import type { Thing } from '~/db'
import { db } from '~/db'
import e from '~/db/edgeql'

export const ThingSelector = e.Thing['*']
export type ThingDTO = Pick<Thing, keyof typeof ThingSelector>
export type CreateThingDTO = Pick<Thing, 'name' | 'description'>

export const getThings = (userId: string): Promise<ThingDTO[]> =>
  e
    .select(e.Thing, (thing) => ({
      ...ThingSelector,
      filter: e.op(thing.user.id, '=', e.uuid(userId)),
    }))
    .run(db)

export const getThing = (
  id: string,
  userId: string
): Promise<ThingDTO | null> =>
  e
    .select(e.Thing, (thing) => ({
      ...ThingSelector,
      filter: e.op(thing.user.id, '=', e.uuid(userId)),
      filter_single: { id },
    }))
    .run(db)

export const createThing = (th: CreateThingDTO, userId: string) =>
  e
    .select(
      e.insert(e.Thing, {
        ...th,
        user: e.select(e.User, () => ({
          filter_single: { id: userId },
        })),
      }),
      () => ThingSelector
    )
    .run(db)

export const deleteThing = (id: string, userId: string): Promise<unknown> =>
  e
    .delete(e.Thing, (thing) => ({
      filter: e.op(thing.user.id, '=', e.uuid(userId)),
      filter_single: { id },
    }))
    .run(db)
