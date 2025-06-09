import { configure } from 'quasar/wrappers';

module.exports = configure(function (ctx) {
  return {
    boot: [
      'axios',
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'roboto-font',
      'material-icons',
    ],

    build: {
      target: {
        browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
        node: 'node20'
      },

      vueRouterMode: 'hash',

      // --- THIS IS THE CRITICAL FIX ---
      // This section explicitly loads environment variables from a .env file
      // AND from the hosting provider (like Vercel).
      env: require('dotenv').config().parsed,
      // --- END OF FIX ---
    },

    devServer: {
      open: true
    },

    framework: {
      config: {},
      plugins: [
        'Notify'
      ]
    },

    animations: [],

    // ... (the rest of the file can remain the same: ssr, pwa, cordova, etc.)
  }
});