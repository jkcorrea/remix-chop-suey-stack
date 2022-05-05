/**
 * @type {import('tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
  ],
}
