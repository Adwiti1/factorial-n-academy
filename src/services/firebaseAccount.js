import {
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from 'firebase/auth'
import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase.js'

function currentUser() {
  if (!isFirebaseConfigured || !auth.currentUser) {
    throw new Error('A signed-in Firebase user is required.')
  }

  return auth.currentUser
}

export async function sendCurrentUserVerification() {
  const user = currentUser()

  if (!user.emailVerified) {
    await sendEmailVerification(user)
  }
}

export async function sendAccountPasswordReset(email) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured.')
  }

  await sendPasswordResetEmail(auth, email)
}

export async function updateCurrentAccountEmail(nextEmail) {
  const user = currentUser()
  await updateEmail(user, nextEmail)
  await setDoc(
    doc(db, 'users', user.uid),
    {
      email: nextEmail,
      emailVerified: user.emailVerified,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function updateCurrentAccountPassword(nextPassword) {
  const user = currentUser()
  await updatePassword(user, nextPassword)
}

export async function syncAccountVerificationStatus(role) {
  const user = currentUser()
  const data = {
    email: user.email,
    emailVerified: user.emailVerified,
    updatedAt: serverTimestamp(),
  }

  await setDoc(doc(db, 'users', user.uid), data, { merge: true })

  if (role === 'teacher') {
    await setDoc(doc(db, 'teachers', user.uid), data, { merge: true })
  }

  if (role === 'student') {
    await setDoc(doc(db, 'students', user.uid), data, { merge: true })
  }

  return {
    id: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    role,
  }
}
