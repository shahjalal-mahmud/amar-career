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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setCompanies(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  const createCompany = (data) =>
    addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() })

  const updateCompany = (id, data) =>
    updateDoc(doc(db, COL, id), data)

  const deleteCompany = (id) =>
    deleteDoc(doc(db, COL, id))

  return { companies, loading, createCompany, updateCompany, deleteCompany }
}