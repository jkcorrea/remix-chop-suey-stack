// Utility functions shared between client & server

/** Helper to combine tailwind class strings & filter out falsy values. */
export const classNames = (
  ...classes: (string | null | undefined | boolean)[]
) => classes.filter(Boolean).join(' ')

/** Throws if `process.env` does not contain the specified variable, */
export const requireEnv = (
  envVar: keyof NodeJS.ProcessEnv,
  envObj = process.env
) => {
  const val = envObj[envVar]
  if (val === undefined)
    throw new Error(`Env variable: '${envVar}' is not set!`)
  return val
}

/** Like `requireEnv`, but for an array of env vars. */
export const requireEnvs = (
  envVars: (keyof NodeJS.ProcessEnv)[],
  envObj = process.env
) => envVars.map((e) => requireEnv(e, envObj))

/** Like Object.hasOwnProperty but narrows the TypeScript type. */
export const hasOwnProperty = <T, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> =>
  Object.prototype.hasOwnProperty.call(obj, prop)
