import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const JOBS_COLLECTION = 'jobs'

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Real-time listener — updates UI instantly when Firestore changes
  useEffect(() => {
    const q = query(
      collection(db, JOBS_COLLECTION),
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
        setJobs(data)
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

  // Create a new job
  const createJob = async (formData) => {
    const payload = {
      ...formData,
      status: 'Saved',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), payload)
    return docRef.id
  }

  // Update an existing job (partial update)
  const updateJob = async (id, formData) => {
    const ref = doc(db, JOBS_COLLECTION, id)
    await updateDoc(ref, {
      ...formData,
      updatedAt: serverTimestamp(),
    })
  }

  // Update only the status field
  const updateJobStatus = async (id, status) => {
    const ref = doc(db, JOBS_COLLECTION, id)
    await updateDoc(ref, { status, updatedAt: serverTimestamp() })
  }

  // Delete a job
  const deleteJob = async (id) => {
    await deleteDoc(doc(db, JOBS_COLLECTION, id))
  }

  return { jobs, loading, error, createJob, updateJob, updateJobStatus, deleteJob }
}