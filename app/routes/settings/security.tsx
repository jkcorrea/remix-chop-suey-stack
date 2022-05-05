import { UserProfile } from '@clerk/remix'

import SettingsGroupWrapper from '~/components/settings/SettingsGroupWrapper'

const SecurityPage = () => (
  <SettingsGroupWrapper>
    <UserProfile
      hideNavigation
      path="/settings/security"
      routing="path"
      only="security"
    />
  </SettingsGroupWrapper>
)

export default SecurityPage
