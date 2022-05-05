import faker from '@faker-js/faker'

let testUserId: string

describe('with logged in user', () => {
  beforeEach(() => {
    cy.initializeAuth().then((userId) => {
      cy.loginWithToken(userId)
      testUserId = userId
    })
  })

  after(() => {
    if (testUserId) cy.teardownAuth(testUserId)
  })

  describe('smoke tests', () => {
    it('should prompt me to finish my profile', () => {
      cy.visit('/')

      cy.contains('Welcome')
      cy.contains('Please choose an alias')

      cy.get('input[name="alias"]').type(faker.internet.userName())

      cy.findByRole('button', { name: /create/i }).click()

      cy.findByText('No things yet')
    })

    it('should allow you to make & delete a thing', () => {
      const testThing = {
        name: faker.lorem.words(2),
        description: faker.lorem.sentences(1),
      }

      cy.visit('/')

      cy.findByText('No things yet')

      cy.findByRole('link', { name: /create a thing!/i }).click()

      cy.get('input[name="name"]').type(testThing.name)
      cy.get('input[name="description"').type(testThing.description)
      cy.findByRole('button', { name: /create/i }).click()

      cy.findByText(testThing.name)
      cy.findByText(testThing.description)

      cy.visit('/')
      cy.getBySel('delete-thing').first().click()

      cy.findByText('No things yet')
    })
  })
})
