  // frontend/postcss.config.js
  module.exports = {
    plugins: {
      '@tailwindcss/postcss': {
        config: './tailwind.config.js',
      },
      autoprefixer: {},
    },
  }
  