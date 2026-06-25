# Skill Management Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Nuxt 3 portal for searching, viewing, and downloading IDE skills (Markdown files) with a public client and protected admin area.

**Architecture:** Single Nuxt app. Client routes at `/`, Admin routes at `/admin`. Uses PostgreSQL for storage. Tailwind CSS for dark tech UI. The "skill" is fundamentally a Markdown string parsed on the backend.

**Tech Stack:** Nuxt 3, Vue 3, PostgreSQL (pg), Tailwind CSS.

## Global Constraints
- Do NOT delete the existing `items` and `files` database tables.
- Delete all existing application code related to `items` and `files`.
- Remove `@vercel/blob`.
- All new database tables must use the `skill_` prefix.
- The UI theme is "Dark Tech Vibe" (暗黑科技感).

---

### Task 1: Project Cleanup & Tailwind Setup

**Files:**
- Create: `tailwind.config.ts`, `assets/css/main.css`
- Modify: `nuxt.config.ts`, `package.json`, `app.vue`
- Delete: `components/*`, `composables/*`, `pages/index.vue`, `server/api/items/*`, `server/api/files/*`

**Interfaces:**
- Produces: Clean Nuxt setup with Tailwind CSS ready to use.

- [ ] **Step 1: Delete old code and dependencies**
```bash
rm -rf components/* composables/* pages/* server/api/items server/api/files
npm remove @vercel/blob
```

- [ ] **Step 2: Install Tailwind CSS**
```bash
npm install -D @nuxtjs/tailwindcss
```

- [ ] **Step 3: Configure Tailwind in `nuxt.config.ts`**
```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    public: {
      appName: 'Skill Portal'
    }
  }
})
```

- [ ] **Step 4: Create `assets/css/main.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-900 text-gray-100 antialiased;
  }
}
```

- [ ] **Step 5: Clean `app.vue`**
```html
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

- [ ] **Step 6: Commit**
```bash
git add .
git commit -m "chore: cleanup old code and setup tailwind"
```

---

### Task 2: Database Schema Initialization

**Files:**
- Modify: `server/db/schema.ts`

**Interfaces:**
- Produces: Database tables `skill_list`, `skill_categories`, `skill_category_map`.

- [ ] **Step 1: Add new tables to `schema.ts`**
```typescript
import { query } from '../db'

export async function ensureTable() {
  // KEEP existing items and files tables
  await query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS files (
      id SERIAL PRIMARY KEY,
      file_id VARCHAR(255) NOT NULL UNIQUE,
      original_name VARCHAR(500) NOT NULL,
      url TEXT NOT NULL,
      size BIGINT NOT NULL DEFAULT 0,
      mime_type VARCHAR(100) NOT NULL,
      item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)

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
```

- [ ] **Step 2: Commit**
```bash
git add server/db/schema.ts
git commit -m "feat(db): add skill tables schema"
```

---

### Task 3: Admin Auth Middleware & API

**Files:**
- Create: `server/api/auth/login.post.ts`, `server/api/auth/logout.post.ts`, `server/api/auth/check.get.ts`, `middleware/admin.ts`

**Interfaces:**
- Produces: Auth cookie `admin_token`

- [ ] **Step 1: Create Login API `server/api/auth/login.post.ts`**
```typescript
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
```

- [ ] **Step 2: Create Logout API `server/api/auth/logout.post.ts`**
```typescript
export default defineEventHandler((event) => {
  deleteCookie(event, 'admin_token', { path: '/' })
  return { success: true }
})
```

- [ ] **Step 3: Create Check API `server/api/auth/check.get.ts`**
```typescript
export default defineEventHandler((event) => {
  const token = getCookie(event, 'admin_token')
  if (token !== 'authenticated') {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return { authenticated: true }
})
```

- [ ] **Step 4: Create Middleware `middleware/admin.ts`**
```typescript
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.client) {
    try {
      await $fetch('/api/auth/check')
    } catch {
      return navigateTo('/admin/login')
    }
  }
})
```

- [ ] **Step 5: Commit**
```bash
git add server/api/auth middleware
git commit -m "feat(auth): implement admin authentication"
```

---

### Task 4: Categories Backend API

**Files:**
- Create: `server/api/categories/index.get.ts`, `server/api/categories/index.post.ts`, `server/api/categories/[id].delete.ts`

- [ ] **Step 1: Get Categories `server/api/categories/index.get.ts`**
```typescript
import { query } from '../../db'

export default defineEventHandler(async () => {
  const result = await query('SELECT * FROM skill_categories ORDER BY name ASC')
  return result.rows
})
```

- [ ] **Step 2: Create Category `server/api/categories/index.post.ts`**
```typescript
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
```

- [ ] **Step 3: Delete Category `server/api/categories/[id].delete.ts`**
```typescript
import { query } from '../../db'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin_token')
  if (token !== 'authenticated') throw createError({ statusCode: 401 })

  const id = getRouterParam(event, 'id')
  await query('DELETE FROM skill_categories WHERE id = $1', [id])
  return { success: true }
})
```

- [ ] **Step 4: Commit**
```bash
git add server/api/categories
git commit -m "feat(api): add categories CRUD"
```

---

### Task 5: Skills Backend API

**Files:**
- Create: `server/api/skills/index.get.ts`, `server/api/skills/index.post.ts`, `server/api/skills/[id].get.ts`, `server/api/skills/[id].delete.ts`, `server/api/skills/[id]/download.get.ts`

- [ ] **Step 1: List Skills `server/api/skills/index.get.ts`**
```typescript
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
```

- [ ] **Step 2: Create/Update Skill Logic `server/api/skills/index.post.ts`**
```typescript
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
```

- [ ] **Step 3: Get Single Skill `server/api/skills/[id].get.ts`**
```typescript
import { query } from '../../db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Increment view count
  await query('UPDATE skill_list SET view_count = view_count + 1 WHERE id = $1', [id])
  
  const result = await query('SELECT * FROM skill_list WHERE id = $1', [id])
  if (result.rows.length === 0) throw createError({ statusCode: 404 })
    
  return result.rows[0]
})
```

- [ ] **Step 4: Download Skill `server/api/skills/[id]/download.get.ts`**
```typescript
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
```

- [ ] **Step 5: Delete Skill `server/api/skills/[id].delete.ts`**
```typescript
import { query } from '../../db'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'admin_token')
  if (token !== 'authenticated') throw createError({ statusCode: 401 })

  const id = getRouterParam(event, 'id')
  await query('DELETE FROM skill_list WHERE id = $1', [id])
  return { success: true }
})
```

- [ ] **Step 6: Commit**
```bash
git add server/api/skills
git commit -m "feat(api): add skills backend endpoints"
```

---

### Task 6: Admin Frontend

**Files:**
- Create: `layouts/admin.vue`, `pages/admin/login.vue`, `pages/admin/index.vue`

- [ ] **Step 1: Admin Layout `layouts/admin.vue`**
```html
<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <header class="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-cyan-400">Admin Portal</h1>
      <button @click="logout" class="text-sm text-gray-400 hover:text-white">Logout</button>
    </header>
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
<script setup>
const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  navigateTo('/admin/login')
}
</script>
```

- [ ] **Step 2: Login Page `pages/admin/login.vue`**
```html
<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 w-96">
      <h2 class="text-2xl font-bold text-center text-cyan-400 mb-6">Admin Login</h2>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input v-model="password" type="password" placeholder="Password" class="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-400" />
        </div>
        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
        <button type="submit" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition">Login</button>
      </form>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: false })
const password = ref('')
const error = ref('')
const login = async () => {
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { password: password.value } })
    navigateTo('/admin')
  } catch (e) {
    error.value = 'Invalid password'
  }
}
</script>
```

- [ ] **Step 3: Admin Dashboard `pages/admin/index.vue`**
```html
<template>
  <div>
    <div class="flex justify-between mb-6">
      <h2 class="text-2xl font-bold">Skills Management</h2>
      <button @click="showForm = true" class="bg-cyan-600 px-4 py-2 rounded text-sm">Add Skill</button>
    </div>
    
    <div v-if="showForm" class="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
      <h3 class="text-xl mb-4">New Skill</h3>
      <textarea v-model="form.content" rows="10" class="w-full bg-gray-900 border border-gray-600 rounded p-4 text-gray-200 font-mono text-sm mb-4" placeholder="# Skill Name\n<description>...</description>\n\nPrompt content..."></textarea>
      <div class="flex gap-2">
        <button @click="submit" class="bg-cyan-600 px-4 py-2 rounded">Save</button>
        <button @click="showForm = false" class="bg-gray-600 px-4 py-2 rounded">Cancel</button>
      </div>
    </div>

    <div class="grid gap-4">
      <div v-for="skill in skills" :key="skill.id" class="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between">
        <div>
          <h4 class="font-bold text-cyan-300">{{ skill.name }}</h4>
          <p class="text-sm text-gray-400">{{ skill.description }}</p>
        </div>
        <button @click="deleteSkill(skill.id)" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { data: skills, refresh } = await useFetch('/api/skills')
const showForm = ref(false)
const form = ref({ content: '' })

const submit = async () => {
  await $fetch('/api/skills', { method: 'POST', body: form.value })
  showForm.value = false
  form.value.content = ''
  refresh()
}
const deleteSkill = async (id) => {
  if (confirm('Are you sure?')) {
    await $fetch(`/api/skills/${id}`, { method: 'DELETE' })
    refresh()
  }
}
</script>
```

- [ ] **Step 4: Commit**
```bash
git add layouts pages/admin
git commit -m "feat(ui): add admin portal interface"
```

---

### Task 7: Client Frontend

**Files:**
- Create: `layouts/default.vue`, `pages/index.vue`, `pages/skills/[id].vue`

- [ ] **Step 1: Default Layout `layouts/default.vue`**
```html
<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-cyan-900 selection:text-cyan-100">
    <header class="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          SKILL<span class="text-white">PORTAL</span>
        </NuxtLink>
        <NuxtLink to="/admin" class="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors">/admin</NuxtLink>
      </div>
    </header>
    <main class="max-w-5xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>
```

- [ ] **Step 2: Home Page `pages/index.vue`**
```html
<template>
  <div>
    <div class="mb-10 relative">
      <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <span class="text-gray-500">🔍</span>
      </div>
      <input v-model="search" type="text" placeholder="Search skills by name or description..." class="w-full bg-gray-900/80 border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink v-for="skill in skills" :key="skill.id" :to="`/skills/${skill.id}`" class="group block p-6 bg-gray-900 rounded-2xl border border-gray-800 hover:border-cyan-500/30 hover:bg-gray-800/80 transition-all duration-300">
        <h3 class="text-xl font-bold text-gray-100 group-hover:text-cyan-400 mb-2">{{ skill.name }}</h3>
        <p class="text-gray-400 text-sm line-clamp-2 mb-4">{{ skill.description }}</p>
        <div class="flex items-center text-xs text-gray-500 font-mono gap-4">
          <span>👁 {{ skill.view_count }}</span>
          <span>⬇ {{ skill.download_count }}</span>
        </div>
      </NuxtLink>
    </div>
    
    <div v-if="!skills?.length" class="text-center py-20 text-gray-500">
      No skills found.
    </div>
  </div>
</template>
<script setup>
const search = ref('')
const debouncedSearch = ref('')
let timeout
watch(search, (val) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => { debouncedSearch.value = val }, 300)
})

const { data: skills } = await useFetch('/api/skills', {
  query: { search: debouncedSearch }
})
</script>
```

- [ ] **Step 3: Detail Page `pages/skills/[id].vue`**
```html
<template>
  <div v-if="skill">
    <div class="mb-6 flex justify-between items-start">
      <div>
        <NuxtLink to="/" class="text-cyan-400 hover:text-cyan-300 text-sm font-mono mb-4 inline-block">← Back</NuxtLink>
        <h1 class="text-3xl font-bold text-white mb-2">{{ skill.name }}</h1>
        <div class="flex gap-4 text-sm text-gray-500 font-mono">
          <span>Views: {{ skill.view_count }}</span>
          <span>Downloads: {{ skill.download_count }}</span>
        </div>
      </div>
      <a :href="`/api/skills/${skill.id}/download`" target="_blank" class="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center gap-2">
        <span>Download Skill</span>
      </a>
    </div>
    
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-inner overflow-x-auto">
      <pre class="text-gray-300 font-mono text-sm whitespace-pre-wrap">{{ skill.content }}</pre>
    </div>
  </div>
</template>
<script setup>
const route = useRoute()
const { data: skill } = await useFetch(`/api/skills/${route.params.id}`)
</script>
```

- [ ] **Step 4: Commit**
```bash
git add layouts pages
git commit -m "feat(ui): add client portal interface"
```
