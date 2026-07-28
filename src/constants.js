/* ────────────────────────────────────────────────────────────────────
   Shared constants used across multiple pages/components.

   Kept deliberately small: only values that are actually duplicated or
   referenced in more than one place. Page-specific styling stays local.
   ──────────────────────────────────────────────────────────────────── */

/* Job-application status. Display order for the filter tabs. */
export const STATUS_TABS = [
  'All',
  'Saved',
  'Applied',
  'Shortlisted',
  'Interview',
  'Rejected',
  'Accepted',
]

/* Hex color for each status — used for tabs, dots, bars, badges. */
export const STATUS_COLORS = {
  Saved:       '#94a3b8',
  Applied:     '#60a5fa',
  Shortlisted: '#fbbf24',
  Interview:   '#34d399',
  Rejected:    '#f87171',
  Accepted:    '#a78bfa',
}

/**
 * Convert a hex color (#rrggbb) to an "r,g,b" string usable in rgba().
 * Used to derive faint backgrounds/borders from the shared status hex.
 */
export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r},${g},${b}`
}

/**
 * Derive a richer { bg, border, text, dot } object from a status hex,
 * so badge-like UI on cards can build tinted backgrounds consistently.
 */
export function statusStyle(status) {
  const text = STATUS_COLORS[status] || STATUS_COLORS.Saved
  const rgb  = hexToRgb(text)
  return {
    text,
    dot:  text,
    bg:    `rgba(${rgb},0.1)`,
    border:`rgba(${rgb},0.2)`,
  }
}
