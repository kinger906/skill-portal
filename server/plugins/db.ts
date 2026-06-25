import { ensureTable } from '../db/schema'

export default defineNitroPlugin(async (nitroApp) => {
  try {
    await ensureTable()
    console.log('[db] Tables initialized')
  } catch (e) {
    console.error('[db] Table initialization failed:', e)
  }
})