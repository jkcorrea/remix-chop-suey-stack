import type { Profile } from '@edgeql'
import e from '@edgeql'

import { db } from '~/services/db.server'

export type UserProfile = Pick<Profile, 'id' | 'alias' | 'userId'>
export type CreateProfile = Pick<Profile, 'alias' | 'userId'>

export const getProfileByUserId = async (
  userId: string
): Promise<UserProfile | null> =>
  await e
    .select(e.Profile, (p) => ({
      id: true,
      alias: true,
      userId: true,
      filter: e.op(p.userId, '=', userId),
    }))
    .assert_single()
    .run(db)

export const createProfile = async (
  profile: CreateProfile
): Promise<{ id: string }> => e.insert(e.Profile, profile).run(db)

export const __DANGEROUS__deleteProfile = async (userId: string) =>
  e.delete(e.Profile, (p) => ({ filter: e.op(p.userId, '=', userId) })).run(db)
