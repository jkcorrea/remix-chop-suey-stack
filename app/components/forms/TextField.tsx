import React from 'react'

import { tw } from '~/lib/tw'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  wrapperClassName?: string
}

export const TextField = ({
  label,
  error,
  wrapperClassName,
  ...inputProps
}: Props) => (
  <div className={tw('form-control w-full', wrapperClassName)}>
    {label && (
      <label className="label">
        <span
          className={tw('label-text text-xs uppercase', error && 'text-error')}
        >
          {label}
        </span>
        {inputProps.required && <span className="label-text-alt">*</span>}
      </label>
    )}
    <input
      type="text"
      {...inputProps}
      className={tw(
        'input-bordered input w-full',
        error && 'input-error',
        ...(inputProps?.className ?? [])
      )}
    />
    {error && (
      <label className="label py-1">
        <span className="label-text-alt text-xs text-error">{error}</span>
      </label>
    )}
  </div>
)
