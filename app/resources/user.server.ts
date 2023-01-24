import type { Account, User } from '~/db'
import { db } from '~/db'
import e from '~/db/edgeql'
import type { UserSession } from '~/services/auth/session.server'
import { UserSessionSelector } from '~/services/auth/session.server'

export type CreateEmailUserDTO = Pick<
  User,
  'avatar' | 'email' | 'name' | 'passwordHash'
>
export type CreateAccountDTO = Pick<
  Account,
  'provider' | 'providerAccountId' | 'accessToken' | 'refreshToken'
>
export type CreateAccountUserDTO = Partial<CreateEmailUserDTO> & {
  account: CreateAccountDTO
}

export const createUser = async (
  data: CreateEmailUserDTO | CreateAccountUserDTO
): Promise<UserSession> => {
  let user: UserSession
  if ('account' in data) {
    const { account, ...rest } = data
    const res = await e
      .select(
        e.insert(e.Account, {
          ...account,
          user: e.insert(e.User, rest),
        }),
        () => ({
          user: UserSessionSelector,
        })
      )
      .run(db)
    user = res.user
  } else {
    user = await e
      .select(e.insert(e.User, data), () => UserSessionSelector)
      .run(db)
  }

  return user
}

export const getUserByProviderId = async (
  provider: Account['provider'],
  providerAccountId: string
) =>
  e
    .select(e.Account, () => ({
      user: UserSessionSelector,
      filter_single: { provider, providerAccountId },
    }))
    .run(db)
    .then((res) => res?.user ?? null)

export const getUserByEmail = async (email: string) =>
  e
    .select(e.User, () => ({
      ...UserSessionSelector,
      passwordHash: true,
      filter_single: { email },
    }))
    .run(db)
    .then((res) => res ?? null)

export const updateUserPassword = async (email: string, passwordHash: string) =>
  e
    .select(
      e.update(e.User, () => ({
        filter_single: { email },
        set: {
          passwordHash,
        },
      })),
      () => UserSessionSelector
    )
    .run(db)

export const deleteUser = async (id: string) =>
  e.delete(e.User, () => ({ filter_single: { id } })).run(db)
