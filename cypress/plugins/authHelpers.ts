import { installGlobals } from '@remix-run/node'
installGlobals()

import ClerkApi from '@clerk/clerk-sdk-node'

import { __DANGEROUS__deleteProfile } from '~/models/profile.server'

const CLERK_API_BASE = 'https://api.clerk.dev/v1'

export type FindOrCreateUserArgs = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type SignInToken = {
  object: string
  id: string
  user_id: string
  token: string
  status: string
  created_at: number
  updated_at: number
}

/**
 * Returns a user with matching email, otherwise creates and returns a new one
 * @param params Params to create user with if found
 * @returns User, either a new one or the one found
 */
export const findOrCreateUser = async ({
  email,
  password,
  firstName,
  lastName,
}: FindOrCreateUserArgs) => {
  const users = await ClerkApi.users.getUserList({
    emailAddress: [email],
  })

  if (users && users.length > 0) return users[0].id

  const user = await ClerkApi.users.createUser({
    emailAddress: [email],
    password,
    firstName,
    lastName,
    skipPasswordChecks: true,
  })

  return user.id
}

export const deleteUserById = async (userId: string) => {
  await ClerkApi.users.deleteUser(userId)
  await __DANGEROUS__deleteProfile(userId)
  return true
}

export const createSignInToken = async (user_id: string) => {
  const path = `${CLERK_API_BASE}/sign_in_tokens`

  const res = await fetch(path, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLERK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id }),
  })

  const tokenObj = (await res.json()) as SignInToken | null
  if (!tokenObj?.token)
    throw new Error(`failed to generate sign in token: ${tokenObj}`)

  return tokenObj.token
}
