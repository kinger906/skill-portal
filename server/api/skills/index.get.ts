import { query } from '../../db'

export default defineEventHandler(async (event) => {
  const { search, category } = getQuery(event)
  let sql = `
    SELECT s.id, s.name, s.description, s.view_count, s.download_count, s.created_at, s.updated_at,
           json_agg(json_build_object('id', c.id, 'name', c.name)) as categories
    FROM skill_list s
    LEFT JOIN skill_category_map scm ON s.id = scm.skill_id
    LEFT JOIN skill_categories c ON scm.category_id = c.id
    WHERE 1=1
  `
  const params: any[] = []
  
  if (search) {
    params.push(`%${search}%`)
    sql += ` AND (s.name ILIKE $${params.length} OR s.description ILIKE $${params.length})`
  }
  
  sql += ` GROUP BY s.id ORDER BY s.created_at DESC`
  
  const result = await query(sql, params)
  
  // Filter by category if needed (in memory for simplicity or add HAVING clause)
  let rows = result.rows
  if (category) {
    rows = rows.filter(r => r.categories && r.categories.some((c: any) => c && c.id == category))
  }
  
  return rows.map(r => ({
    ...r,
    categories: r.categories.filter((c: any) => c != null)
  }))
})