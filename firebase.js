import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// 🔧 Replace these with your actual Firebase project config
// Go to: Firebase Console → Your Project → Project Settings → Your Apps → SDK setup
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)