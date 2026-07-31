const CATEGORIES = ['Love', 'Nature', 'Philosophy', 'Tragedy', 'Hope', 'Spirituality', 'Freedom', 'War', 'Death', 'Joy', 'Reflection', 'Fantasy']

import { getLanguageName } from '../../constants/languages'

export default function WritePoemModal({
  open, onClose, onSave, editingPoem,
  title, onTitleChange,
  content, onContentChange,
  categories, onCategoriesChange,
  lang,
}) {
  if (!open) return null

  function toggleCategory(cat) {
    if (categories.includes(cat)) {
      onCategoriesChange(categories.filter((c) => c !== cat))
    } else if (categories.length < 3) {
      onCategoriesChange([...categories, cat])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose} style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl p-6 animate-fade-in"
        style={{ backgroundColor: 'var(--tp-surface)', border: '1.5px solid var(--tp-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--tp-text)', fontFamily: '"Playfair Display", serif' }}>
          {editingPoem ? 'Edit Poem' : 'Write a Poem'}
        </h2>
        <input value={title} onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Poem title..."
          className="w-full px-3 py-2 rounded-xl mb-3 text-sm outline-none"
          style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)' }}
        />
        <textarea value={content} onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write your poem here..." rows={10}
          className="w-full px-3 py-2 rounded-xl mb-3 text-sm outline-none resize-none"
          style={{ backgroundColor: 'var(--tp-bg)', color: 'var(--tp-text)', border: '1.5px solid var(--tp-border)', fontFamily: '"Playfair Display", Georgia, serif', lineHeight: '1.7' }}
        />
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--tp-secondary)', color: '#fff' }}>
            {getLanguageName(lang) || lang}
          </span>
        </div>
        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--tp-text-secondary)' }}>Categories (up to 3):</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const selected = categories.includes(cat)
              return (
                <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                  className="text-xs px-2.5 py-1 rounded-full transition-all"
                  style={{
                    backgroundColor: selected ? 'var(--tp-secondary)' : 'var(--tp-bg)',
                    color: selected ? '#fff' : 'var(--tp-text-secondary)',
                    border: '1px solid var(--tp-border)',
                    opacity: !selected && categories.length >= 3 ? 0.4 : 1,
                  }}
                >{cat}</button>
              )
            })}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={() => { onClose(); onTitleChange(''); onContentChange(''); onCategoriesChange([]) }}
            className="px-4 py-2 rounded-xl text-sm transition-colors"
            style={{ color: 'var(--tp-text-secondary)', backgroundColor: 'var(--tp-bg)' }}>Cancel</button>
          <button onClick={onSave}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--tp-secondary)' }}>{editingPoem ? 'Update' : 'Save Poem'}</button>
        </div>
      </div>
    </div>
  )
}
