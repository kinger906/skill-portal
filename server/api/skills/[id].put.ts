import { query } from '../../db'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin_token')
  if (token !== 'authenticated') throw createError({ statusCode: 401 })

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const content = body.content || ''
  
  // Auto-parse name and description
  let name = 'Untitled Skill'
  let description = ''

  // Try to parse YAML Frontmatter (--- ... ---)
  const frontmatterMatch = content.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/);
  if (frontmatterMatch) {
    const fmContent = frontmatterMatch[1];
    const nameFm = fmContent.match(/^name:\s*(.+)$/m);
    if (nameFm) name = nameFm[1].trim();
    
    const descFm = fmContent.match(/^description:\s*(.+)$/m);
    if (descFm) description = descFm[1].trim();
  }

  // Fallback 1: XML-like tags (<name>, <description>)
  if (name === 'Untitled Skill') {
    const nameMatch = content.match(/<name>(.*?)<\/name>/i);
    if (nameMatch) name = nameMatch[1].trim();
  }
  if (!description) {
    const descMatch = content.match(/<description>(.*?)<\/description>/is);
    if (descMatch) description = descMatch[1].trim();
  }

  // Fallback 2: Markdown headers and paragraphs
  if (name === 'Untitled Skill') {
    const nameMatch = content.match(/^#\s+(.*)/m);
    if (nameMatch) name = nameMatch[1].trim();
  }
  
  if (!description) {
    // Fallback to first text paragraph after frontmatter/headers
    const lines = content.split('\n').filter((l: string) => l.trim() && !l.startsWith('#') && l.trim() !== '---' && !l.startsWith('name:') && !l.startsWith('description:'))
    description = lines.length > 0 ? lines[0].substring(0, 200) : ''
  }

  // Update skill
  await query(
    'UPDATE skill_list SET name = $1, description = $2, content = $3, updated_at = NOW() WHERE id = $4',
    [name, description, content, id]
  )

  // Update categories (delete existing and insert new)
  await query('DELETE FROM skill_category_map WHERE skill_id = $1', [id])
  if (body.categoryIds && Array.isArray(body.categoryIds)) {
    for (const cid of body.categoryIds) {
      await query('INSERT INTO skill_category_map (skill_id, category_id) VALUES ($1, $2)', [id, cid])
    }
  }

  return { success: true, id }
})