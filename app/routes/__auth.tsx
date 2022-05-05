import { Outlet } from '@remix-run/react'

const AuthLayout = () => (
  <div className="flex h-screen flex-col justify-center">
    <div className="mx-auto w-full p-8 md:max-w-2xl">
      <Outlet />
    </div>
  </div>
)

export default AuthLayout
