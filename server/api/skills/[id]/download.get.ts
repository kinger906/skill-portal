import { query } from '../../../db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Increment download count
  await query('UPDATE skill_list SET download_count = download_count + 1 WHERE id = $1', [id])
  
  const result = await query('SELECT name, content FROM skill_list WHERE id = $1', [id])
  if (result.rows.length === 0) throw createError({ statusCode: 404 })
  
  const skill = result.rows[0]
  const safeName = skill.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  
  setHeader(event, 'Content-Type', 'text/markdown')
  setHeader(event, 'Content-Disposition', `attachment; filename="${safeName}.md"`)
  
  return skill.content
})