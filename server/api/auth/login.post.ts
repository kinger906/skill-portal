export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  if (body.password === config.adminPassword) {
    setCookie(event, 'admin_token', 'authenticated', {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      path: '/'
    })
    return { success: true }
  }
  
  throw createError({ statusCode: 401, message: 'Invalid password' })
})