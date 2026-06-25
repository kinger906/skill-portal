import { query } from '../../db'

export default defineEventHandler(async () => {
  const result = await query('SELECT * FROM skill_categories ORDER BY name ASC')
  return result.rows
})