import { UserProfile } from '@clerk/remix'

import SettingsGroupWrapper from '~/components/settings/SettingsGroupWrapper'

const AccountPage = () => (
  <SettingsGroupWrapper>
    <UserProfile
      hideNavigation
      path="/settings"
      routing="path"
      only="account"
    />
  </SettingsGroupWrapper>
)

export default AccountPage
