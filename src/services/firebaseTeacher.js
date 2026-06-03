import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase.js'

function currentUserId() {
  if (!auth.currentUser) {
    throw new Error('A signed-in Firebase user is required.')
  }

  return auth.currentUser.uid
}

function makeJoinCode(name) {
  return name
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 6)
    .toUpperCase()
    .padEnd(6, 'X')
}

export async function saveFirebaseEducatorAccount(account) {
  const teacherId = currentUserId()
  const baseProfile = {
    displayName: account.displayName,
    email: account.email,
    role: 'teacher',
    language: account.language ?? 'English',
    createdAt: serverTimestamp(),
  }

  await setDoc(doc(db, 'users', teacherId), baseProfile, { merge: true })
  await setDoc(
    doc(db, 'teachers', teacherId),
    {
      schoolName: account.schoolName,
      countryRegion: account.countryRegion,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return { id: teacherId, ...baseProfile }
}

export async function saveFirebaseTeacherProfile(profile) {
  const teacherId = currentUserId()
  await updateDoc(doc(db, 'teachers', teacherId), {
    ...profile,
    updatedAt: serverTimestamp(),
  })
}

export async function createFirebaseClassroom(classroom) {
  const teacherId = currentUserId()
  const joinCode = makeJoinCode(classroom.name)

  const classroomRef = await addDoc(collection(db, 'classrooms'), {
    ...classroom,
    teacherId,
    joinCode,
    studentIds: [],
    progress: 0,
    upcoming: 'Invite students to begin',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    id: classroomRef.id,
    ...classroom,
    teacherId,
    joinCode,
    students: 0,
    progress: 0,
  }
}

export async function getFirebaseTeacherClassrooms() {
  const teacherId = currentUserId()
  const classroomsQuery = query(
    collection(db, 'classrooms'),
    where('teacherId', '==', teacherId),
  )
  const snapshot = await getDocs(classroomsQuery)

  return snapshot.docs.map((classroomDoc) => ({
    id: classroomDoc.id,
    ...classroomDoc.data(),
  }))
}

export async function getFirebaseClassroomById(classroomId) {
  const classroomRef = doc(db, 'classrooms', classroomId)
  const snapshot = await getDoc(classroomRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}
