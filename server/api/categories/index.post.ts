import { query } from '../../db'

export default defineEventHandler(async (event) => {
  // Ensure auth
  const token = getCookie(event, 'admin_token')
  if (token !== 'authenticated') throw createError({ statusCode: 401 })

  const body = await readBody(event)
  if (!body.name) throw createError({ statusCode: 400, message: 'Name required' })

  const result = await query('INSERT INTO skill_categories (name) VALUES ($1) RETURNING *', [body.name])
  return result.rows[0]
})