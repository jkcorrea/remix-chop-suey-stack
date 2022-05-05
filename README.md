<p style="text-align:center;">
  <img src="./public/assets/soad.webp" width="100%" />
  <h1 style="text-align:center;">Remix Chop Suey Stack</h1>
</p>

Forked from [Supa Fly Stack](https://github.com/rphlmr/supa-fly-stack).

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix --template jkcorrea/remix-chop-suey-stack
```

## Why this stack?

I run my startup on [Redwood](https://redwoodjs.com/) + [Supabase](https://supabase.com/) + [Prisma](https://www.prisma.io/). All great projects that I still recommend, but a few things have been paining me:
- Prisma can feel janky. Migrations occasionally get out of sync, rollbacks are a mess, schemas aside from `public` aren't supported in migrations, generated queries can start to suck for complex logic.
- Supabase, as of today, requires a minor in SQL to get shit done (though, [I do agree](https://twitter.com/jkcorrea_/status/1507155640635981844?s=20&t=c1JQQpk2_ZtnIB3-2xHRiA) it is the right approach, I just don't have time to think about DB management right now)
- My Redwood codebase got a bit bloated. There's more "state" in the system than I'd like, making it difficult to add new code without breaking old code. I didn't make use of many of the niceties of Redwood (Cells, Storybook, tests, etc), and so have a lot of bloat for no reason in the project now.

My thought is that EdgeDB will take care of the shaky migration + SQL management problems, while Remix may help me reduce the state & logic to reason about between the front & back ends.

It ended up being a lot of exploratory work to get all these technologies working together since they're all fairly new, so I figured I should package it up as a template while I'm at it 🤠


## So what's in it?

The hits:
- [EdgeDB](https://www.edgedb.com/) newfangled graph-relational database
- [Fly.io](https://fly.io) app deployment
- [TailwindCSS](https://tailwindcss.com/) for styling, plus
  - [HeadlessUI](https://headlessui.dev/)
  - [DaisyUI](https://daisyui.com/)
- [Clerk](https://clerk.dev/) for simple auth
- [TypeScript](https://typescriptlang.org), [Prettier](https://prettier.io), [ESLint](https://eslint.org)
  - w/ my opinionated configs :)

Bonus tracks:
- Test/Release
  - [Vitest](https://vitest.dev) - unit testing
  - [Cypress](https://cypress.io) - e2e testing
  - [MSW](https://mswjs.io) - mock network requests
  - [Testing Library](https://testing-library.com) - test helpers
  - [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- [Zod](https://github.com/colinhacks/zod) + [Remix Params Helper](https://github.com/kiliman/remix-params-helper) - client & server form validation
- [React Hot Toast](https://react-hot-toast.com/) - toast notification manager
- [React Icons](https://react-icons.github.io/react-icons) for easy, tree-shakable icon sets
- [lodash-es](https://www.npmjs.com/package/lodash-es) - tree-shakable lodash
- [Tiny Invariant](https://github.com/alexreardon/tiny-invariant) - nice little helper for use in loaders & actions
- [Remix Utils](https://github.com/sergiodxa/remix-utils) - various remix helpers
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)

Not a fan of bits of the stack? Fork it, change it, and use `npx create-remix --template your/repo`! Make it your own.

## TODO

a.k.a. the wishlist

- [ ] Deploy to Fly w/ EdgeDB (& document)
- [ ] Database dev/test seeds
- [ ] Setup some actual unit tests
- [ ] Mock auth (so we don't have to create/delete users on the real Clerk api)
- [ ] Consider moving over to [Playwright](https://playwright.dev/) for e2e tests

## Setup

### EdgeDB

First install the cli via the [EdgeDB installation guide](https://www.edgedb.com/docs/guides/quickstart), then in this project directory run (the initializer prompts to do this for you):

  ```sh
  edgedb project init
  ```

### Clerk Auth

Setup an account at [Clerk.dev](https://clerk.dev) to your liking. When ready, copy the relevant API keys into your `.env`.

## Development

This starts your app in development mode, rebuilding assets on file changes.

```sh
yarn dev
```

### Relevant Files

This is a pretty simple CRUD app, but it's a good example of how you can build a full stack app with Prisma, Supabase and Remix. The main functionality is creating users, logging in and out (handling access and refresh tokens + refresh on expire), and creating and deleting notes.

- auth [./app/services/auth.server.ts](./app/services/auth.server.ts)
- user sessions, and verifying them [./app/services/session.server.ts](./app/services/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

## Deployment

> Do what you know if you are a Fly.io expert.

This Remix Stack comes with GitHub Actions that handle automatically testing (unit & integration) and deploying your app to production and staging environments on Fly.io.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly create remix-chop-suey-stack
  fly create remix-chop-suey-stack-staging
  ```

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add your other secrets from `.env` to your Fly app. You can do this with a command similar to:

  ```sh
  # staging
  fly secrets set CLERK_FRONTEND_API="CLERK_FRONTEND_API" --app remix-chop-suey-stack-staging
  fly secrets set CLERK_API_KEY="CLERK_API_KEY" --app remix-chop-suey-stack-staging
  fly secrets set CLERK_JWT_KEY="CLERK_JWT_KEY" --app remix-chop-suey-stack-staging

  # production
  fly secrets set CLERK_FRONTEND_API="CLERK_FRONTEND_API" --app remix-chop-suey-stack
  fly secrets set CLERK_API_KEY="CLERK_API_KEY" --app remix-chop-suey-stack
  fly secrets set CLERK_JWT_KEY="CLERK_JWT_KEY" --app remix-chop-suey-stack
  ```


Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

👉 **You have to add some env secrets for cypress.** 👈

Add the same secrets as above to your GitHub actions (https://docs.github.com/en/actions/security-guides/encrypted-secrets).

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, complete your `.env` and run `yarn test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.teardownAuth();
});
```

That way, we can keep your test db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `yarn typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `yarn format` script you can run to format all files in the project.

