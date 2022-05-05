import { SignUp } from '@clerk/remix'

import AuthWrapper from '~/components/AuthWrapper'

// NOTE: note the awkward filename "login.$.tsx"
// this allows Clerk's Remix lib to takeover for subroutes

const SignUpPage = () => (
  <AuthWrapper title="Sign Up">
    <SignUp routing="path" path="/sign-up" />
  </AuthWrapper>
)

export default SignUpPage
