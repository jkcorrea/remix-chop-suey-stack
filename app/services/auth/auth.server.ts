import { Authenticator } from 'remix-auth'

import { sessionStorage } from '~/services/auth/session.server'

import FormStrategy from './strategies/form.server'
import { socialStrategiesMap } from './strategies/socials.server'
import type { UserSession } from './session.server'

export const authenticator = new Authenticator<UserSession>(sessionStorage, {
  sessionErrorKey: 'SESSION_ERROR',
  throwOnError: true,
})

// Always use email form strategy by default
authenticator.use(FormStrategy)

/** Tracks which strategies actually get used so we can render them in auth pages. */
export const enabledStrategies: string[] = []

for (const [key, createProvider] of Object.entries(socialStrategiesMap)) {
  const clientID = process.env[`${key}_CLIENT_ID`]
  const clientSecret = process.env[`${key}_CLIENT_SECRET`]
  if (clientID && clientSecret) {
    authenticator.use(createProvider(clientID, clientSecret))
    enabledStrategies.push(key)
  }

  // Warn if only one of the two is set
  if (clientID || clientSecret) {
    // eslint-disable-next-line no-console
    console.warn(
      `Both ${key}_CLIENT_ID and ${key}_CLIENT_SECRET must be set to use ${key} strategy.`
    )
  }
}
