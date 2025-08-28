/**
 * TailwindCSS configuration for the case converter application.  Dark mode
 * is enabled via the class strategy so that it can be toggled at runtime.
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