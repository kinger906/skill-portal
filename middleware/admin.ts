export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    try {
      await $fetch('/api/auth/check')
    } catch {
      return navigateTo('/admin/login')
    }
  }
})