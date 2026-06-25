import { query } from '../db'

export async function ensureTable() {
  // ADD skill tables
  await query(`
    CREATE TABLE IF NOT EXISTS skill_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS skill_list (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      content TEXT NOT NULL,
      view_count INTEGER DEFAULT 0,
      download_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS skill_category_map (
      skill_id INTEGER REFERENCES skill_list(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES skill_categories(id) ON DELETE CASCADE,
      PRIMARY KEY (skill_id, category_id)
    )
  `)
}