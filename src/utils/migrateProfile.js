// ════════════════════════════════════════════════════════════════════════════
//  src/utils/migrateProfile.js — ONE-TIME migration script
// ════════════════════════════════════════════════════════════════════════════
//  Reads the legacy hardcoded src/data/Profile.js and seeds its contents into
//  Firestore so the existing author data isn't lost.
//
//  After running this successfully and verifying the data appears correctly
//  on the Profile page, src/data/Profile.js can be **manually deleted** by
//  the author. This script does NOT delete it automatically — keep it around
//  long enough to confirm the migration is good.
//
//  How to run:
//    • From the Profile page (when the DB is empty): click the
//      "Seed from old data" button that appears in the empty state.
//    • From the browser DevTools console (after navigating to the Profile page):
//        const { seedProfileToFirestore } = await import('/src/utils/migrateProfile.js')
//        await seedProfileToFirestore(window.__db)   // see Profile.jsx for wiring
// ════════════════════════════════════════════════════════════════════════════

import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { profile } from '../data/Profile'

/**
 * Write the legacy Profile.js contents into Firestore.
 * @param {import('firebase/firestore').Firestore} db - The Firestore instance.
 * @returns {Promise<{mainWritten: boolean, blocksWritten: number}>}
 */
export async function seedProfileToFirestore(db) {
  /* ── 1. Hero / main doc ─────────────────────────────────────────────── */
  await setDoc(
    doc(db, 'profile', 'main'),
    {
      name:           profile.basic?.name ?? '',
      title:          profile.basic?.title ?? '',
      location:       profile.basic?.location ?? '',
      links:          Array.isArray(profile.links)
        ? profile.links.map((l) => ({ label: l.label, url: l.url }))
        : [],
      avatarInitials: profile.basic?.initials ?? '',
    },
    { merge: true }
  )

  /* ── 2. Build the blocks array ──────────────────────────────────────── */
  const blocks = []

  // Personal Info — bio + short bio
  if (profile.bio) {
    blocks.push({ section: 'Personal Info', title: 'Bio', content: profile.bio, order: 0 })
  }
  if (profile.bioShort) {
    blocks.push({ section: 'Personal Info', title: 'Short Bio', content: profile.bioShort, order: 1 })
  }

  // Skills — flatten techStack into per-category blocks
  if (Array.isArray(profile.techStack)) {
    profile.techStack.forEach((cat, i) => {
      const lines = (cat.items || []).map((it) => `- **${it.name}** — ${it.level}`).join('\n')
      blocks.push({
        section: 'Skills',
        title:   cat.category,
        content: lines,
        order:   100 + i,
      })
    })
  }

  // Experience
  if (Array.isArray(profile.experience)) {
    profile.experience.forEach((exp, i) => {
      const lines = [
        `**${exp.role}** · ${exp.company}`,
        `*${exp.period} · ${exp.location}*`,
        '',
        exp.description,
        '',
        ...(exp.highlights || []).map((h) => `- ${h}`),
        '',
        `**Stack:** ${(exp.stack || []).join(', ')}`,
      ].join('\n')
      blocks.push({
        section: 'Experience',
        title:   `${exp.role} @ ${exp.company}`,
        content: lines,
        order:   200 + i,
      })
    })
  }

  // Education
  if (Array.isArray(profile.education)) {
    profile.education.forEach((ed, i) => {
      const lines = [
        `**${ed.degree}** — ${ed.institution}`,
        `*${ed.period} · CGPA ${ed.cgpa}*`,
        '',
        '**Coursework:**',
        ...(ed.coursework || []).map((c) => `- ${c}`),
        '',
        '**Highlights:**',
        ...(ed.highlights || []).map((h) => `- ${h}`),
      ].join('\n')
      blocks.push({
        section: 'Education',
        title:   ed.shortName || ed.institution,
        content: lines,
        order:   300 + i,
      })
    })
  }

  // Projects — current + featured + past
  const allProjects = [
    ...(profile.currentProjects || []),
    ...(profile.featuredWork || []),
    ...(profile.pastProjects || []),
  ]
  allProjects.forEach((p, i) => {
    const bullets = p.highlights || p.bullets || []
    const parts = [
      p.tagline || p.subtitle || '',
      '',
      p.description || p.desc || '',
      bullets.length ? bullets.map((h) => `- ${h}`).join('\n') : '',
      p.stack ? `\n**Stack:** ${p.stack.join(', ')}` : '',
      p.tags  ? `\n**Tags:** ${p.tags.join(', ')}`  : '',
      p.link  ? `\n**Link:** ${p.link}`            : '',
    ].filter(Boolean)
    blocks.push({
      section: 'Projects',
      title:   p.name,
      content: parts.join('\n'),
      order:   400 + i,
    })
  })

  // Certifications — none in the legacy data; author can add via UI.

  // Achievements
  if (Array.isArray(profile.achievements)) {
    profile.achievements.forEach((a, i) => {
      const lines = [
        a.description || '',
        a.link ? `\n**Link:** ${a.link}` : '',
      ].filter(Boolean).join('\n')
      blocks.push({
        section: 'Achievements',
        title:   a.title,
        content: lines,
        order:   600 + i,
      })
    })
  }

  /* ── 3. Write all blocks ────────────────────────────────────────────── */
  let written = 0
  for (const b of blocks) {
    await addDoc(collection(db, 'profileBlocks'), {
      ...b,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    written += 1
  }

  return { mainWritten: true, blocksWritten: written }
}
