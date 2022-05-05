import React from 'react'
import { ClerkLoaded, ClerkLoading } from '@clerk/remix'

import Skeleton from './ui/Skeleton'

type Props = {
  title?: string
  children: React.ReactNode
}

const AuthWrapper = ({ title, children }: Props) => (
  <div className="space-y-5 text-center">
    {title && <h1>{title}</h1>}

    <ClerkLoading>
      <Skeleton className="h-[566px] max-h-full w-[460px] max-w-full" />
    </ClerkLoading>

    <ClerkLoaded>{children}</ClerkLoaded>
  </div>
)

export default AuthWrapper
