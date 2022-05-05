// import { rest } from 'msw'
import { USER_EMAIL, USER_ID } from './user'

export const authSession = {
  refresh_token: 'valid',
  access_token: 'valid',
  user: {
    id: USER_ID,
    email: USER_EMAIL,
  },
}

export const CLERK_BASE_URL = 'https://api.clerk.dev/v1'

// TODO implement mocks for Clerk so we don't have to keep making/deleting users
export const handlers = [
  // rest.get(`${CLERK_BASE_URL}/users`, async (req, res, ctx) => {
  //   const { email, password, refresh_token } = JSON.parse(req.body as string)
  //   if (refresh_token) {
  //     if (refresh_token !== 'valid')
  //       return res(ctx.status(401), ctx.json({ error: 'Token expired' }))
  //     return res(ctx.status(200), ctx.json(authSession))
  //   }
  //   if (!email || !password || password !== USER_PASSWORD)
  //     return res(
  //       ctx.status(401),
  //       ctx.json({ message: 'Wrong email or password' })
  //     )
  //   return res(ctx.status(200), ctx.json(authSession))
  // })
]
