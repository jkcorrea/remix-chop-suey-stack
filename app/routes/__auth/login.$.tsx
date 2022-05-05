import { SignIn } from '@clerk/remix'

import AuthWrapper from '~/components/AuthWrapper'

// NOTE: note the awkward filename "login.$.tsx"
// this allows Clerk's Remix lib to takeover for subroutes

const LoginPage = () => (
  <AuthWrapper>
    <SignIn routing="path" path="/login" />
  </AuthWrapper>
)

export default LoginPage
