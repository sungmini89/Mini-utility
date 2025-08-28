/**
 * TailwindCSS configuration for the letter vocabulary calculator.
 *
 * Dark mode is configured using the `class` strategy to allow the
 * application to toggle themes at runtime.  The content paths tell
 * Tailwind where to search for class names so unused styles can be
 * purged in production builds.
 */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};