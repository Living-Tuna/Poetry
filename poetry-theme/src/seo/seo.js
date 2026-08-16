export const SITE_URL = 'https://blendly.sbs'
export const SITE_NAME = 'Blendly'
export const SITE_TAGLINE = 'Lend & borrow books nearby, read and share poetry.'

export const DEFAULT_TITLE = 'Blendly — Lend Books Nearby & Read Poetry Online'
export const DEFAULT_DESCRIPTION =
  'Blendly lets you lend and borrow real books with readers near you, and read independent, historic and ancient poetry — with a daily verse, favorites and translations.'

export function slugify(str) {
  return (
    String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'poem'
  )
}

export function poemUrl(poem) {
  return `${SITE_URL}/poem/${encodeURIComponent(String(poem.id))}/${slugify(poem.title)}`
}

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (content) {
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, key)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  } else if (el) {
    el.remove()
  }
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (href) {
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', rel)
      document.head.appendChild(el)
    }
    el.setAttribute('href', href)
  } else if (el) {
    el.remove()
  }
}

function setJsonLd(data) {
  document.head.querySelectorAll('script[data-seo="app"]').forEach((s) => s.remove())
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-seo', 'app')
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export function applySeo({ title, description, canonical, image, jsonLd, noindex } = {}) {
  document.title = title || DEFAULT_TITLE
  setMeta('name', 'description', description || DEFAULT_DESCRIPTION)
  setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
  setMeta('property', 'og:title', document.title)
  setMeta('property', 'og:description', description || DEFAULT_DESCRIPTION)
  setMeta('property', 'og:url', canonical)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', SITE_NAME)
  setMeta('property', 'og:image', image || `${SITE_URL}/icons.svg`)
  setMeta('name', 'twitter:card', 'summary')
  setMeta('name', 'twitter:title', document.title)
  setMeta('name', 'twitter:description', description || DEFAULT_DESCRIPTION)
  setMeta('name', 'twitter:image', image || `${SITE_URL}/icons.svg`)
  setLink('canonical', canonical || SITE_URL)
  setJsonLd(jsonLd)
}

export function poemJsonLd(poem) {
  const url = poemUrl(poem)
  const text = String(poem.content || '').slice(0, 900)
  const author = poem.author || 'Unknown'
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Poem',
      headline: poem.title,
      author: { '@type': 'Person', name: author },
      text,
      url,
      inLanguage: poem.language || 'en',
      isAccessibleForFree: true,
      datePublished: poem.created_at || undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: poem.title, item: url },
      ],
    },
  ]
}

export const PAGE_SEO = {
  dashboard: {
    title: 'Blendly — Lend Books Nearby & Read Poetry Online',
    description:
      'Read independent, historic and ancient poetry, save favorite lines, and lend or borrow real books with readers near you on Blendly.',
  },
  blend: {
    title: 'Blend — Search Books and Find Readers Near You',
    description:
      'Search any book title on Blendly and find real readers nearby to lend, borrow and share books.',
  },
  favorites: {
    title: 'Favorite Lines — Saved Poetry on Blendly',
    description: 'Your saved favorite poem lines on Blendly, kept newest first.',
    noindex: true,
  },
  shelf: {
    title: 'My Bookshelf — Lend & Borrow Books | Blendly',
    description: 'Track the books you own, want, or are lending and borrowing on Blendly.',
  },
  'my-writings': {
    title: 'My Writings — Share Your Poetry | Blendly',
    description: 'Write and publish your own poems on Blendly and share them with readers.',
    noindex: true,
  },
  categories: {
    title: 'Poetry Categories — Browse Poems | Blendly',
    description: 'Browse poetry by category on Blendly — love, nature, sacred, classic and more.',
  },
  about: {
    title: 'About Blendly — Lending Books & Poetry',
    description: 'Learn how Blendly connects readers to lend books nearby and share poetry.',
  },
  inbox: { title: 'Inbox — Messages | Blendly', description: 'Your book-lending messages on Blendly.', noindex: true },
  notifications: { title: 'Notifications | Blendly', description: 'Your Blendly notifications.', noindex: true },
  settings: { title: 'Settings | Blendly', description: 'Manage your Blendly account and preferences.', noindex: true },
  changelog: { title: "What's New — Blendly Changelog", description: 'Recent updates and new features on Blendly.' },
}
