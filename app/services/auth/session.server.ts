import { createCookieSessionStorage } from '@remix-run/node'

import type { User } from '~/db'
import { requireEnv } from '~/lib/utils'

declare module '@remix-run/node' {
  interface SessionData extends UserSession {}
}

export const UserSessionSelector = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  avatar: true,
} as const
export type UserSession = Pick<User, keyof typeof UserSessionSelector>

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [requireEnv('SESSION_SECRET')], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
    maxAge: 1000 * 60 * 60 * 24 * 14, // 2 weeks
  },
})

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage

// NOTE: if you want to use a database to store your session data, you can do like this:
// export const sessionStorage = createSessionStorage({
//   cookie: {
//     name: '_session', // use any name you want here
//     sameSite: 'lax', // this helps with CSRF
//     path: '/', // remember to add this so the cookie will work in all routes
//     httpOnly: true, // for security reasons, make this cookie http only
//     secrets: [requireEnv('SESSION_SECRET')], // replace this with an actual secret
//     secure: process.env.NODE_ENV === 'production', // enable this in prod only
//     maxAge: 1000 * 60 * 60 * 24 * 14, // 2 weeks
//   },
//  async createData(data, exp) {
//    // `expires` is a Date after which the data should be considered
//    // invalid. You could use it to invalidate the data somehow or
//    // automatically purge this record from your database.
//    const expiresAt = exp ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
//    const token = crypto.randomUUID()
//  try {
//    await e
//      .insert(e.Session, {
//        token,
//        expiresAt,
//        user: e
//          .select(e.User, () => ({
//            filter_single: { id: data.id },
//          }))
//          .assert_single(),
//      })
//      .run(db)
//  } catch (err) { }
//    return token
//  },
//   async readData(token) {
//     const sess = await e
//       .select(e.Session, () => ({
//         user: () => UserSessionSelector,
//         filter_single: { token },
//       }))
//       .run(db)

//     return sess?.user || null
//   },
//   async updateData(token, _data, expiresAt) {
//     await e
//       .update(e.Session, () => ({
//         filter_single: { token },
//         set: { expiresAt },
//       }))
//       .run(db)
//   },
//   async deleteData(id) {
//     await e.delete(e.Session, () => ({ filter_single: { id } })).run(db)
//   },
// })
