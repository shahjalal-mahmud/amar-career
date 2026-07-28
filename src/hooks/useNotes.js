import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const COL = 'notes'

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Real-time listener — updates UI instantly when Firestore changes
  useEffect(() => {
    const q = query(
      collection(db, COL),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          // Convert Firestore timestamps to ISO strings for easy use
          createdAt: d.data().createdAt?.toDate?.()?.toISOString() ?? null,
          updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() ?? null,
        }))
        setNotes(data)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Create a new note
  const createNote = async (formData) => {
    const payload = {
      ...formData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    const docRef = await addDoc(collection(db, COL), payload)
    return docRef.id
  }

  // Update an existing note
  const updateNote = async (id, formData) => {
    const ref = doc(db, COL, id)
    await updateDoc(ref, {
      ...formData,
      updatedAt: serverTimestamp(),
    })
  }

  // Delete a note
  const deleteNote = async (id) => {
    await deleteDoc(doc(db, COL, id))
  }

  return { notes, loading, error, createNote, updateNote, deleteNote }
}
