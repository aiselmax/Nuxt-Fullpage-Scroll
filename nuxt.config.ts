// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/scripts'
  ],
  plugins: ["~/plugins/vuetify.js", "~/plugins/gsap.client.js"],
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    "~/assets/styles/main.scss",
  ],
  build: {
    transpile: ['vuetify','gsap'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})