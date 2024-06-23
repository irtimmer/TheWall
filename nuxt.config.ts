import path from 'path';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-primevue'],
  primevue: {
    importPT: { from: path.resolve(__dirname, './presets/aura/') },
    options: {
      unstyled: true
    }
  }
})
