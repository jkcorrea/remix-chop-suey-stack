/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  root: true,
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config/jest-testing-library',
    'plugin:tailwindcss/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['tailwindcss', 'simple-import-sort', 'unused-imports', 'prettier'],
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
    'app/db/edgeql',
    'app/styles/tailwind.css',
  ],
  // we're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but it we have to explicitly
  // set the jest version.
  settings: {
    jest: {
      version: 27,
    },
    // Help eslint-plugin-tailwindcss to parse Tailwind classes outside of className
    tailwindcss: {
      callees: ['tw'],
    },
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-console': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    // @typescript-eslint
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'all',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: false,
      },
    ],
    // tailwind eslint plugin
    'tailwindcss/no-custom-classname': 'off',
    // import sorts
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // Side effect imports first
          ['^\\u0000'],
          // Node.js builtins
          [
            '^node:.*$',
            `^(${require('module').builtinModules.join('|')})(/|$)`,
          ],
          // React first, then any other packages
          ['^react$', '^@?\\w'],
          // Honcho packages
          ['^@honcho(/.*|$)'],
          // Absolute imports (doesn"t start with .)
          ['^(\\.|@)prisma', '^[^.]', '^src/'],
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
  overrides: [
    // Allow default export for server entry & route files
    {
      files: [
        './app/root.tsx',
        './app/entry.client.tsx',
        './app/entry.server.tsx',
        './app/routes/**/*.tsx',
      ],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    // Turn on some typescript rules for typescript files
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ],
}
