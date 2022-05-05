import { Outlet } from '@remix-run/react'
import { BsBoxArrowUpLeft, BsPersonCircle, BsShieldLock } from 'react-icons/bs'

import type { TabItem } from '~/components/settings/SettingsTabBar'
import SettingsTabBar from '~/components/settings/SettingsTabBar'

const tabs: TabItem[] = [
  { to: '/', name: 'Back to Home', Icon: BsBoxArrowUpLeft },
  { to: '/settings', name: 'Account', Icon: BsPersonCircle },
  { to: '/settings/security', name: 'Security', Icon: BsShieldLock },
]

const SettingsLayout = () => (
  <main className="absolute inset-0 max-h-screen overflow-hidden">
    <div className="h-full lg:grid lg:grid-cols-12">
      {/* Settings Tab Bar */}
      <SettingsTabBar tabs={tabs} />

      {/* Main Content */}
      <div className="space-y-6 overflow-y-auto sm:px-6 lg:col-span-9 lg:px-0">
        <Outlet />
      </div>
    </div>
  </main>
)

export default SettingsLayout
