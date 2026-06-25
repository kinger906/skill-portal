import { query } from '../../db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Increment view count
  await query('UPDATE skill_list SET view_count = view_count + 1 WHERE id = $1', [id])
  
  const result = await query('SELECT * FROM skill_list WHERE id = $1', [id])
  if (result.rows.length === 0) throw createError({ statusCode: 404 })
    
  return result.rows[0]
})