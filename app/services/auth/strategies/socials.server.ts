import type { Strategy } from 'remix-auth'
import {
  DiscordStrategy,
  FacebookStrategy,
  GitHubStrategy,
  GoogleStrategy,
  MicrosoftStrategy,
  SocialsProvider,
  TwitterStrategy,
} from 'remix-auth-socials'

import { SERVER_URL } from '~/lib/constants'
import type { CreateAccountUserDTO } from '~/resources/user.server'
import { createUser, getUserByProviderId } from '~/resources/user.server'

import type { UserSession } from '../session.server'

export const getSocialCallbackUrl = (provider: keyof typeof SocialsProvider) =>
  `${SERVER_URL}/auth/${SocialsProvider[provider]}/callback`

async function findOrCreateAccount(data: CreateAccountUserDTO) {
  const { provider, providerAccountId } = data.account
  const user = await getUserByProviderId(provider, providerAccountId)
  if (user) return user

  // Creates and stores a new user in database.
  const newUser = await createUser(data)
  if (!newUser) throw new Error('Failed to create a new user.')

  // Returns newly created user as Session.
  return newUser
}

type SocialStrategyMap = {
  [K in keyof typeof SocialsProvider]: (
    clientID: string,
    clientSecret: string
  ) => Strategy<UserSession, any>
}

// Export a map of all social strategies
export const socialStrategiesMap: SocialStrategyMap = {
  DISCORD: (clientID, clientSecret) =>
    new DiscordStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: getSocialCallbackUrl('DISCORD'),
      },
      ({ profile, accessToken, refreshToken }) =>
        findOrCreateAccount({
          account: {
            provider: 'DISCORD',
            providerAccountId: profile.id,
            accessToken,
            refreshToken,
          },
          name: profile.displayName,
          email: profile.__json.email ?? undefined,
          avatar: profile.__json.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.__json.avatar}.png`
            : '',
        })
    ),
  FACEBOOK: (clientID, clientSecret) =>
    new FacebookStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: getSocialCallbackUrl('FACEBOOK'),
      },
      ({ profile, accessToken, refreshToken }) =>
        findOrCreateAccount({
          account: {
            provider: 'FACEBOOK',
            providerAccountId: profile.id,
            accessToken,
            refreshToken,
          },
          name: profile.displayName,
          email: profile.emails[0]?.value ?? undefined,
          avatar: profile.photos[0]?.value ?? undefined,
        })
    ),
  GITHUB: (clientID, clientSecret) =>
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: getSocialCallbackUrl('GITHUB'),
      },
      ({ profile, accessToken, refreshToken }) =>
        findOrCreateAccount({
          account: {
            provider: 'GITHUB',
            providerAccountId: profile.id,
            accessToken,
            refreshToken,
          },
          name: profile.displayName,
          email: profile._json.email,
          avatar: profile._json.avatar_url,
        })
    ),
  GOOGLE: (clientID, clientSecret) =>
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: getSocialCallbackUrl('GOOGLE'),
      },
      ({ profile, accessToken, refreshToken }) =>
        findOrCreateAccount({
          account: {
            provider: 'GOOGLE',
            providerAccountId: profile.id,
            accessToken,
            refreshToken,
          },
          name: profile.displayName,
          email: profile._json.email,
          avatar: profile._json.picture,
        })
    ),
  MICROSOFT: (clientId, clientSecret) =>
    new MicrosoftStrategy(
      {
        clientId,
        clientSecret,
        redirectUri: getSocialCallbackUrl('MICROSOFT'),
      },
      ({ profile, accessToken, refreshToken }) =>
        findOrCreateAccount({
          account: {
            provider: 'MICROSOFT',
            providerAccountId: profile.id,
            accessToken,
            refreshToken,
          },
          name: profile.displayName,
          email: profile.emails[0]?.value ?? undefined,
          avatar: profile.photos ? profile.photos[0].value : undefined,
        })
    ),
  TWITTER: (clientID, clientSecret) =>
    new TwitterStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: getSocialCallbackUrl('TWITTER'),
      },
      ({ profile, accessToken, accessTokenSecret: refreshToken }) =>
        findOrCreateAccount({
          account: {
            provider: 'TWITTER',
            providerAccountId: profile.id_str,
            accessToken,
            refreshToken,
          },
          name: profile.name,
          email: profile.email ?? undefined,
          avatar: profile.profile_image_url,
        })
    ),
}
