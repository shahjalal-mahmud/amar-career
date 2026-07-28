import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const MAIN_DOC_ID = 'main'

/**
 * Profile is split across two Firestore locations per project.md §4.4:
 *   - profile/main               (single doc) — hero info
 *   - profileBlocks (collection) — section content blocks
 *
 * This hook returns live data + write helpers for both.
 */
export function useProfile() {
  /* ── Hero info ── */
  const [profileMain, setProfileMain] = useState(null)
  const [mainLoading, setMainLoading] = useState(true)
  const [mainError, setMainError]     = useState(null)

  /* ── Section content blocks ── */
  const [blocks, setBlocks]             = useState([])
  const [blocksLoading, setBlocksLoading] = useState(true)
  const [blocksError, setBlocksError]   = useState(null)

  // Live listener for profile/main
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'profile', MAIN_DOC_ID),
      (snap) => {
        setProfileMain(snap.exists() ? { id: snap.id, ...snap.data() } : null)
        setMainLoading(false)
      },
      (err) => {
        console.error('Profile main error:', err)
        setMainError(err.message)
        setMainLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  // Live listener for profileBlocks, ordered by `order` asc
  useEffect(() => {
    const q = query(collection(db, 'profileBlocks'), orderBy('order', 'asc'))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? null,
          updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() ?? null,
        }))
        setBlocks(data)
        setBlocksLoading(false)
      },
      (err) => {
        console.error('Profile blocks error:', err)
        setBlocksError(err.message)
        setBlocksLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  /* ── Hero writes ── */
  const updateProfileMain = async (data) => {
    await setDoc(doc(db, 'profile', MAIN_DOC_ID), data, { merge: true })
  }

  /* ── Block writes ── */
  const createBlock = async (data) => {
    const payload = {
      section: data.section,
      title:   data.title,
      content: data.content,
      order:   data.order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    const docRef = await addDoc(collection(db, 'profileBlocks'), payload)
    return docRef.id
  }

  const updateBlock = async (id, data) => {
    const ref = doc(db, 'profileBlocks', id)
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  }

  const deleteBlock = async (id) => {
    await deleteDoc(doc(db, 'profileBlocks', id))
  }

  /**
   * Move a block up or down within its section by swapping the `order`
   * field with its neighbor. Both writes are kicked off in parallel; the
   * onSnapshot listener re-renders the list once Firestore confirms.
   */
  const reorderBlock = async (id, direction /* 'up' | 'down' */) => {
    const target = blocks.find((b) => b.id === id)
    if (!target) return
    const sectionBlocks = blocks
      .filter((b) => b.section === target.section)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const idx = sectionBlocks.findIndex((b) => b.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sectionBlocks.length) return
    const a = sectionBlocks[idx]
    const b = sectionBlocks[swapIdx]
    await Promise.all([
      updateBlock(a.id, { order: b.order ?? 0 }),
      updateBlock(b.id, { order: a.order ?? 0 }),
    ])
  }

  return {
    // Hero
    profileMain, mainLoading, mainError, updateProfileMain,
    // Blocks
    blocks, blocksLoading, blocksError,
    createBlock, updateBlock, deleteBlock, reorderBlock,
  }
}
