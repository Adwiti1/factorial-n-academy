import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../lib/firebase.js'

function currentUserId() {
  if (!isFirebaseConfigured || !auth.currentUser) {
    throw new Error('A signed-in Firebase user is required.')
  }

  return auth.currentUser.uid
}

export async function createFirebaseStudentAccount(account) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured.')
  }

  const credential = await createUserWithEmailAndPassword(
    auth,
    account.email,
    account.password,
  )

  await updateProfile(credential.user, {
    displayName: account.displayName,
  })

  await setDoc(
    doc(db, 'users', credential.user.uid),
    {
      displayName: account.displayName,
      email: credential.user.email,
      role: 'student',
      language: account.language ?? 'English',
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )

  await setDoc(
    doc(db, 'students', credential.user.uid),
    {
      displayName: account.displayName,
      email: credential.user.email,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return {
    id: credential.user.uid,
    displayName: account.displayName,
    email: credential.user.email,
    role: 'student',
  }
}

export async function loginFirebaseStudent({ email, password }) {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured.')
  }

  const credential = await signInWithEmailAndPassword(auth, email, password)
  const userSnapshot = await getDoc(doc(db, 'users', credential.user.uid))

  if (userSnapshot.exists() && userSnapshot.data().role !== 'student') {
    throw new Error('This account is not a student account.')
  }

  return {
    id: credential.user.uid,
    email: credential.user.email,
    displayName: credential.user.displayName,
    role: userSnapshot.exists() ? userSnapshot.data().role : 'student',
  }
}

export async function saveFirebaseStudentOnboarding(onboarding) {
  const studentId = currentUserId()
  await setDoc(
    doc(db, 'students', studentId),
    {
      onboarding,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return onboarding
}

export async function saveFirebaseStudentGoals(goals) {
  const studentId = currentUserId()
  await setDoc(
    doc(db, 'students', studentId),
    {
      goals,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return goals
}
