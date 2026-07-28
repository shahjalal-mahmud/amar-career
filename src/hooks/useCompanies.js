import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'

const COL = 'companies'

export function useCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => {
          const raw = d.data()
          return {
            id: d.id,
            ...raw,
            /* Backward-compat: pre-audit docs were written with the legacy `tag` field.
               Normalize here so the rest of the app can rely on `category`. */
            category: raw.category ?? raw.tag ?? null,
            /* Normalize Firestore timestamps to ISO strings for easy use elsewhere. */
            lastChecked: raw.lastChecked?.toDate?.()?.toISOString() ?? null,
            createdAt:  raw.createdAt?.toDate?.()?.toISOString()  ?? null,
            updatedAt:  raw.updatedAt?.toDate?.()?.toISOString()  ?? null,
          }
        })
        setCompanies(data)
        setError(null)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore companies error:', err)
        setError(err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  const createCompany = (data) =>
    addDoc(collection(db, COL), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

  const updateCompany = (id, data) =>
    updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() })

  /* spec §4.2: `lastChecked` is a Firestore timestamp, written by serverTimestamp */
  const markCompanyChecked = (id) =>
    updateDoc(doc(db, COL, id), {
      lastChecked: serverTimestamp(),
      updatedAt:   serverTimestamp(),
    })

  const deleteCompany = (id) =>
    deleteDoc(doc(db, COL, id))

  return {
    companies, loading, error,
    createCompany, updateCompany, markCompanyChecked, deleteCompany,
  }
}