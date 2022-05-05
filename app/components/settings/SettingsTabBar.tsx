import { Link } from '@remix-run/react'
import type { IconType } from 'react-icons'

import { classNames } from '~/lib/utils'

import ForwardIsActive from '../ui/ForwardIsActive'

export type TabItem = {
  name: string
  to: string
  Icon: IconType
}

type TabBarProps = {
  tabs: TabItem[]
}

const SettingsTabBar = ({ tabs }: TabBarProps) => (
  <aside className="lg:col-span-2 lg:py-0 lg:px-0">
    <ul className="menu w-full bg-base-100 px-0">
      {tabs.map((tab) => (
        <ForwardIsActive key={tab.to} to={tab.to} end>
          {({ isActive }) => (
            <li
              className={classNames(
                'inline-flex space-x-2',
                isActive ? 'bordered text-primary' : 'text-base-content'
              )}
            >
              <Link to={tab.to} className="py-4">
                <tab.Icon className="text-xl" />
                <span className="truncate">{tab.name}</span>
              </Link>
            </li>
          )}
        </ForwardIsActive>
      ))}
    </ul>
  </aside>
)
export default SettingsTabBar
