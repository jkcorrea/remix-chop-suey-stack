import React from 'react'

type Props = {
  name?: string
  description?: string
  children: React.ReactNode
}

const SettingsGroupWrapper = ({ name, description, children }: Props) => {
  const labelId = name ? `${name}-heading` : undefined

  return (
    <section
      aria-labelledby={labelId}
      className="bg-white p-2 shadow sm:overflow-hidden sm:rounded-md"
    >
      {(name || description) && (
        <div>
          <h2
            id={labelId}
            className="text-lg font-medium leading-6 text-gray-900"
          >
            {name}
          </h2>
          <p className="mt-1 text-sm text-gray-500"></p>
        </div>
      )}
      {children}
    </section>
  )
}
export default SettingsGroupWrapper
