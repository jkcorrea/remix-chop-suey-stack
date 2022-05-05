import { useResolvedPath } from '@remix-run/react'
import type React from 'react'
import type { To } from 'react-router-dom'
import { useMatch } from 'react-router-dom'

type Props = {
  /** The path to check against */
  to: To
  /** Should partial matches count? */
  end?: boolean
  /** The component to render */
  children: ({ isActive }: { isActive: boolean }) => React.ReactElement
}

/** Resolves whether a given route path is currently active, then forwards isActive to the children */
const ForwardIsActive = ({ to, end = false, children }: Props) => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end })

  return children({ isActive: Boolean(match) })
}

export default ForwardIsActive
