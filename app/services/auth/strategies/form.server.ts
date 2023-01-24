import { parseForm } from 'react-zorm'
import { FormStrategy } from 'remix-auth-form'
import type { z } from 'zod'

import { createUser, getUserByEmail } from '~/resources/user.server'

import { hashPassword, validateHashPassword } from '../encryption.server'
import { AuthFormLoginSchema, AuthFormRegisterSchema } from '../schemas'

export const AUTH_CONTEXT = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
} as const

declare module '@remix-run/node' {
  export interface AppLoadContext {
    action?: keyof typeof AUTH_CONTEXT
    [key: string]: unknown
  }
}

export default new FormStrategy(async ({ form, context }) => {
  const isLogin = context?.action === 'LOGIN' ?? true
  const data = parseForm(
    isLogin ? AuthFormLoginSchema : AuthFormRegisterSchema,
    form
  )
  const { email, password } = data
  const user = await getUserByEmail(email)

  if (isLogin) {
    if (!user) throw new Error('User not found.')
    if (!user.passwordHash)
      throw new Error('No password associated with this account.')

    // Validates provided credentials with database ones.
    const isPasswordValid = await validateHashPassword(
      password,
      user.passwordHash
    )
    if (!isPasswordValid) throw new Error('Invalid credentials.')

    // Sets user to database user.
    return user
  }

  // Else, register user
  if (email === user?.email) throw new Error('Email already in use.')
  const { name } = data as z.infer<typeof AuthFormRegisterSchema>

  const passwordHash = await hashPassword(data.password)

  // Creates and stores a new user in database.
  const newUser = await createUser({
    name,
    email,
    passwordHash,
    avatar: `https://ui-avatars.com/api/?&name=${name}&background=random`,
  })
  if (!newUser) throw new Error('Failed to create a new user.')

  // TODO send email to confirm email address

  // Sets user as newly created user.
  return newUser
})
