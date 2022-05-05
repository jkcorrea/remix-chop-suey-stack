import type { CSSProperties, ElementType } from 'react'

import { classNames } from '~/lib/utils'

interface Props {
  count?: number
  duration?: string
  width?: number | string
  height?: number | string
  wrapper?: ElementType
  circle?: boolean
  style?: CSSProperties
  className?: string
}

const Skeleton = (props: Props) => {
  const {
    count = 1,
    duration,
    width,
    height,
    wrapper: Wrapper,
    circle = false,
    style: customStyle = {},
    className = '',
  } = props

  const elements = []

  for (let i = 0; i < (count || 1); i++) {
    const style: CSSProperties = {}

    if (width) style.width = width
    if (height) style.height = height
    if (width && height && circle) style.borderRadius = '50%'

    elements.push(
      <span
        key={i}
        className={classNames(
          'inline-block w-full animate-pulse rounded-lg bg-gray-200 leading-none',
          className
        )}
        style={{
          ...customStyle,
          ...style,
          ...(duration ? { animationDuration: duration } : {}),
        }}
      >
        &zwnj;
      </span>
    )
  }

  return (
    <>
      {Wrapper
        ? elements.map((element, i) => (
            <Wrapper key={i}>
              {element}
              &zwnj;
            </Wrapper>
          ))
        : elements}
    </>
  )
}

export default Skeleton
