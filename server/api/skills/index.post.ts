import { query } from '../../db'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin_token')
  if (token !== 'authenticated') throw createError({ statusCode: 401 })

  const body = await readBody(event)
  const content = body.content || ''
  
  // Auto-parse name and description
  const nameMatch = content.match(/<name>(.*?)<\/name>/i) || content.match(/^#\s+(.*)/m)
  const name = nameMatch ? nameMatch[1].trim() : 'Untitled Skill'
  
  const descMatch = content.match(/<description>(.*?)<\/description>/is)
  let description = descMatch ? descMatch[1].trim() : ''
  if (!description) {
    // Fallback to first text paragraph
    const lines = content.split('\n').filter((l: string) => l.trim() && !l.startsWith('#'))
    description = lines.length > 0 ? lines[0].substring(0, 200) : ''
  }

  // Insert skill
  const res = await query(
    'INSERT INTO skill_list (name, description, content) VALUES ($1, $2, $3) RETURNING id',
    [name, description, content]
  )
  const skillId = res.rows[0].id

  // Insert categories
  if (body.categoryIds && Array.isArray(body.categoryIds)) {
    for (const cid of body.categoryIds) {
      await query('INSERT INTO skill_category_map (skill_id, category_id) VALUES ($1, $2)', [skillId, cid])
    }
  }

  return { success: true, id: skillId }
})