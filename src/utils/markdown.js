/* ────────────────────────────────────────────────────────────────────
   Shared markdown renderer used by JobCard, Notes, and Profile.

   Reused across pages per project.md §3 ("reuse the renderer already
   used in JobForm.jsx"). Kept here as a plain utility so JSX files can
   stay component-only and play nicely with react-refresh.
   ──────────────────────────────────────────────────────────────────── */

export function renderMarkdown(md) {
  if (!md) return ''
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^---$/gm, '<hr/>')

  html = html.replace(/(?:^|\n)((?:\s*[-*+] .+\n?)+)/gm, (_, block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\s*[-*+] /, '')}</li>`).join('')
    return `\n<ul>${items}</ul>\n`
  })
  html = html.replace(/(?:^|\n)((?:\s*\d+\. .+\n?)+)/gm, (_, block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\s*\d+\. /, '')}</li>`).join('')
    return `\n<ol>${items}</ol>\n`
  })

  html = html.split(/\n\n+/).map((block) => {
    const t = block.trim()
    if (!t) return ''
    if (/^<(h[1-6]|ul|ol|blockquote|hr)/.test(t)) return t
    return `<p>${t.replace(/\n/g, '<br/>')}</p>`
  }).join('\n')

  return html
}