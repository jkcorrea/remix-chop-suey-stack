/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  root: true,
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config/jest-testing-library',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  ignorePatterns: [
    'node_modules',
    '*.js',
    'coverage',
    'server-build',
    'build',
    'public/build',
    '*.ignored/',
    '*.ignored.*',
    '.cache',
    '.history',
    'vitest.config.ts',
    'cypress',
    'test',
    'mocks',
    'prisma',
    'app/database/generated',
    'app/styles/tailwind.css',
  ],
  // we're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but it we have to explicitly
  // set the jest version.
  settings: {
    jest: {
      version: 27,
    },
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-console': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    // meh...
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/sort-type-union-intersection-members': 'off',
    'react/jsx-filename-extension': 'off',
    '@typescript-eslint/no-namespace': 'off',
    // I can't figure these out:
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    // enable these again someday:
    '@typescript-eslint/no-unsafe-argument': 'off',
    // for CatchBoundaries
    '@typescript-eslint/no-throw-literal': 'off',
    // import sorts
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports first
          ['^\\u0000'],
          // React first, then any other packages
          ['^react$', '^@?\\w'],
          // Absolute imports (doesn"t start with .)
          ['^[^.]', '^src/'],
          // Relative imports
          [
            // ../whatever/
            '^\\.\\./(?=.*/)',
            // ../
            '^\\.\\./',
            // ./whatever/
            '^\\./(?=.*/)',
            // Anything that starts with a dot
            '^\\.',
          ],
          // Asset imports
          ['^.+\\.(html|scss|sass|css|json|gql|graphql|md|jpg|png)$'],
        ],
      },
    ],
  },
}
