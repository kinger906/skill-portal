export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    public: {
      appName: 'Skill Portal'
    }
  },
  nitro: {
    preset: 'vercel',
    experimental: {
      openAPI: true
    }
  }
})