import { query } from '../../db'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin_token')
  if (token !== 'authenticated') throw createError({ statusCode: 401 })

  const id = getRouterParam(event, 'id')
  await query('DELETE FROM skill_list WHERE id = $1', [id])
  return { success: true }
})