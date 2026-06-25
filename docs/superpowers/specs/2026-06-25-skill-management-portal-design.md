# Skill Management Portal Design

## 1. Overview
The project is a Skill Management Portal built with Nuxt 3, designed to allow users to search, view, and download IDE skills (Markdown files). It consists of a public-facing Client Portal and a protected Admin Portal, unified within a single Nuxt application.

## 2. Architecture & Routing
- **Framework**: Nuxt 3 (Vue 3)
- **UI Framework**: Tailwind CSS (to achieve the "Dark Tech Vibe" / 暗黑科技感)
- **Database**: PostgreSQL (via `pg` and direct queries in the existing `server/db/index.ts`)

**Routing Map**:
- Client Portal (Layout: `client.vue` or `default.vue`)
  - `/`: Home, search, category filter, list of skills.
  - `/skills/[id]`: Detail view of a skill, download button.
- Admin Portal (Layout: `admin.vue`)
  - `/admin/login`: Simple password login.
  - `/admin`: Dashboard / list of skills.
  - `/admin/skills`: CRUD for skills.
  - `/admin/categories`: CRUD for categories.

## 3. Database Schema
All tables use the `skill_` prefix.

1. **`skill_list`**
   - `id` (SERIAL PRIMARY KEY)
   - `name` (VARCHAR) - Extracted automatically from the Markdown content.
   - `description` (TEXT) - Extracted automatically from the Markdown content.
   - `content` (TEXT) - The full original raw Markdown string pasted by the admin.
   - `view_count` (INTEGER DEFAULT 0)
   - `download_count` (INTEGER DEFAULT 0)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **`skill_categories`**
   - `id` (SERIAL PRIMARY KEY)
   - `name` (VARCHAR)
   - `created_at` (TIMESTAMP)

3. **`skill_category_map`**
   - `skill_id` (INTEGER REFERENCES skill_list(id) ON DELETE CASCADE)
   - `category_id` (INTEGER REFERENCES skill_categories(id) ON DELETE CASCADE)
   - PRIMARY KEY (`skill_id`, `category_id`)

## 4. Workflows

### Admin Workflow (Add/Edit Skill)
1. The Admin navigates to `/admin/skills/new`.
2. They paste the complete `skill.md` text into a large text area and select relevant categories.
3. Upon submission, the backend automatically parses the `content` string to extract:
   - `name` (e.g., from `<name>...</name>` or `# Heading`)
   - `description` (e.g., from `<description>...</description>` or the first paragraph)
4. The system saves the extracted `name`, `description`, and the full original `content` to the `skill_list` table.

### Client Workflow (View & Download)
1. **Search & Filter**: Users can search by `name` or `description`, and filter by categories on the homepage.
2. **View Detail**: Clicking a skill opens `/skills/[id]`. This triggers an API call that increments `view_count` and returns the `content` to be rendered as Markdown.
3. **Download**: Clicking "Download" triggers an API call that:
   - Increments `download_count`.
   - Returns the `content` string with HTTP headers `Content-Type: text/markdown` and `Content-Disposition: attachment; filename="{name}.md"`.

## 5. Security & Auth
- Admin access is protected by a single password stored in `.env` (`ADMIN_PASSWORD`).
- Nuxt middleware intercepts routes under `/admin/*` (except login) to verify an admin cookie/token.

## 6. UI/UX
- **Theme**: Dark mode by default ("暗黑科技感").
- **Colors**: Deep gray/black backgrounds (`bg-gray-900`, `bg-black`), neon accent colors (cyan, purple) for buttons and active states.
- **Components**: Card-based list for skills, prominent search bar, clean markdown renderer for the detail page.

## 7. Cleanup
- Keep the existing `items` and `files` tables (other systems use them), but do not use them for the skill portal features.
- Remove `@vercel/blob` dependency and related code from the *application layer*, as it's no longer needed for skills.
