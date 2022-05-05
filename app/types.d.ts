import type { AppData } from '@remix-run/node'
import type { useMatches } from '@remix-run/react'

declare global {
  type RouteMatch = Omit<ReturnType<typeof useMatches>[number], 'data'> & {
    data: AppData
  }

  type BreadcrumbFunction = (match: RouteMatch) => React.ReactNode

  type RouteHandle = {
    [key: string]: any
    breadcrumb?: BreadcrumbFunction
  }
}
