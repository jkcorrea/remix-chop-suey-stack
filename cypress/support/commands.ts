import user from '../fixtures/user.json'

import type { User } from '@clerk/clerk-sdk-node'
import type ClerkWeb from '@clerk/clerk-js'

export type TestUser = User

declare global {
  namespace Cypress {
    interface Window {
      Clerk: ClerkWeb
    }
    interface Chainable<Subject> {
      /**
       * Initialize auth to a state where you're logged in as the test user.
       *
       * Credit to: https://lynn.zone/blog/e2e-testing-clerk-authentication-in-cypress.
       */
      initializeAuth: () => Chainable<string>

      /**
       * Logs a user in via the Clerk Backend API
       */
      loginWithToken: typeof loginWithToken

      /**
       * Clean up the test user from the db & Clerk
       *
       * Credit to: https://lynn.zone/blog/e2e-testing-clerk-authentication-in-cypress.
       */
      teardownAuth: typeof teardownAuth

      /** Rertrieves elements via the `data-test=` attribute */
      getBySel: typeof cy.get

      /** Rertrieves elements  the `data-test=` attribute */
      getBySelLike: typeof cy.get
    }
  }
}

const initializeAuth = () => {
  cy.then(async () => {
    cy.log('Creating test user...')
    cy.task('findOrCreateUser', {
      email: user.email_address[0],
      password: user.password,
      firstName: user.first_name,
      lastName: user.last_name,
    }).then((userId) => {
      expect(userId).to.be.ok
      cy.wrap(userId).as('userId')
    })
  })
}

const loginWithToken = (userId: string) => {
  cy.then(async () => {
    cy.log('Logging in...')
    cy.task<string>('createSignInToken', userId).then((ticket) => {
      expect(ticket).to.be.ok

      cy.visit('/', { failOnStatusCode: false })

      cy.window()
        .should((window) => {
          expect(window.Clerk.isReady()).to.eq(true)
        })
        .then(async (window) => {
          await window.Clerk.signOut()
          const signIn = await window.Clerk.client?.signIn.create({
            strategy: 'ticket',
            ticket,
          })
          expect(signIn).to.not.be.eq(null, 'Failed to sign in')
        })
    })
  })
}

const teardownAuth = (userId: string) => {
  cy.clearCookie('__session')

  cy.then(async () => {
    cy.log('Deleting test user...')
    cy.task('deleteUserById', userId)
  })
}

const getBySel: typeof cy.get = (selector: string, ...args: any) =>
  cy.get(`[data-test=${selector}]`, ...args)
const getBySelLike: typeof cy.get = (selector: string, ...args: any) =>
  cy.get(`[data-test*=${selector}]`, ...args)

Cypress.Commands.add('getBySel', getBySel)
Cypress.Commands.add('getBySelLike', getBySelLike)
Cypress.Commands.add('initializeAuth', initializeAuth)
Cypress.Commands.add('loginWithToken', loginWithToken)
Cypress.Commands.add('teardownAuth', teardownAuth)
