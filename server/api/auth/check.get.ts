export default defineEventHandler((event) => {
  const token = getCookie(event, 'admin_token')
  if (token !== 'authenticated') {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return { authenticated: true }
})