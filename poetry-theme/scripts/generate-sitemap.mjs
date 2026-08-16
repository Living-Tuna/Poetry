import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function readEnv() {
  const text = readFileSync(resolve(root, '.env'), 'utf8')
  const get = (key) => {
    const line = text.split(/\r?\n/).find((l) => l.startsWith(`${key}=`))
    return line ? line.slice(key.length + 1).trim() : ''
  }
  return { url: get('VITE_SUPABASE_URL'), key: get('VITE_SUPABASE_PUBLISHABLE_KEY') }
}

const SITE_URL = 'https://blendly.sbs'
const LANGS = ['en', 'ml', 'hi']

async function fetchAllPoems({ url, key }) {
  const out = []
  const headers = { apikey: key, Authorization: `Bearer ${key}` }
  let from = 0
  const page = 1000
  while (true) {
    const res = await fetch(
      `${url}/rest/v1/poems?select=id,title,author,language,created_at&order=created_at.asc&limit=${page}&offset=${from}`,
      { headers }
    )
    if (!res.ok) throw new Error(`Supabase request failed: ${res.status} ${await res.text()}`)
    const rows = await res.json()
    out.push(...rows)
    if (rows.length < page) break
    from += page
  }
  return out
}

function slugify(str) {
  return (
    String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'poem'
  )
}

function lastmodOf(date) {
  if (!date) return undefined
  return String(date).slice(0, 10)
}

function urlEntry(loc, { lastmod, priority, changefreq } = {}) {
  const parts = []
  parts.push(`  <url>`)
  parts.push(`    <loc>${loc}</loc>`)
  if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`)
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`)
  if (priority) parts.push(`    <priority>${priority}</priority>`)
  parts.push(`  </url>`)
  return parts.join('\n')
}

async function main() {
  const { url, key } = readEnv()
  if (!url || !key) throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in .env')

  const poems = await fetchAllPoems({ url, key })

  const core = [
    { path: '', prio: '1.0', freq: 'weekly' },
    { path: 'blend', prio: '0.9', freq: 'weekly' },
    { path: 'shelf', prio: '0.7', freq: 'monthly' },
    { path: 'categories', prio: '0.8', freq: 'weekly' },
    { path: 'about', prio: '0.6', freq: 'monthly' },
    { path: 'changelog', prio: '0.3', freq: 'weekly' },
  ]

  const urls = []
  urls.push(urlEntry(SITE_URL, { lastmod: lastmodOf(poems[0]?.created_at), priority: '1.0', changefreq: 'weekly' }))

  for (const lang of LANGS) {
    for (const c of core) {
      if (lang === 'en' && c.path === '') continue
      const loc = lang === 'en' ? `${SITE_URL}/${c.path}` : `${SITE_URL}/${lang}/${c.path}`
      urls.push(
        urlEntry(loc, {
          lastmod: lastmodOf(poems[0]?.created_at),
          priority: c.prio,
          changefreq: c.freq,
        })
      )
    }
  }

  for (const poem of poems) {
    urls.push(
      urlEntry(`${SITE_URL}/poem/${encodeURIComponent(String(poem.id))}/${slugify(poem.title)}`, {
        lastmod: lastmodOf(poem.created_at),
        priority: '0.6',
        changefreq: 'monthly',
      })
    )
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
  mkdirSync(resolve(root, 'public'), { recursive: true })
  writeFileSync(resolve(root, 'public', 'sitemap.xml'), xml)
  console.log(`Wrote public/sitemap.xml with ${urls.length} URLs (${poems.length} poems)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
