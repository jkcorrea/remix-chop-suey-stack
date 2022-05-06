import type { Client } from 'edgedb'
import { createClient } from 'edgedb'

let db: Client

declare global {
  // eslint-disable-next-line no-var
  var __db__: Client | undefined
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production, we'll have a single connection to the DB.

if (process.env.NODE_ENV === 'production') db = createClient()
else {
  if (!global.__db__) global.__db__ = createClient()
  db = global.__db__
}

export { db }
