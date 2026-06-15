import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  where,
} from 'firebase/firestore'
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { auth, db, isFirebaseConfigured, storage } from '../lib/firebase.js'
import {
  sendCurrentUserVerification,
  syncAccountVerificationStatus,
} from './firebaseAccount.js'

export function canUseFirebase() {
  return isFirebaseConfigured
}

function currentUserId() {
  if (!canUseFirebase() || !auth.currentUser) {
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

export async function createFirebaseEducatorAccount(account) {
  if (!canUseFirebase()) {
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

  const savedAccount = await saveFirebaseEducatorAccount({
    ...account,
    email: credential.user.email,
  })

  try {
    await sendCurrentUserVerification()
  } catch (error) {
    console.warn('Email verification could not be sent:', error.message)
  }

  return savedAccount
}

export async function loginFirebaseEducator({ email, password }) {
  if (!canUseFirebase()) {
    throw new Error('Firebase is not configured.')
  }

  const credential = await signInWithEmailAndPassword(auth, email, password)
  const userSnapshot = await getDoc(doc(db, 'users', credential.user.uid))

  if (userSnapshot.exists() && userSnapshot.data().role !== 'teacher') {
    throw new Error('This account is not an educator account.')
  }

  await syncAccountVerificationStatus('teacher')

  return {
    id: credential.user.uid,
    email: credential.user.email,
    displayName: credential.user.displayName,
    emailVerified: credential.user.emailVerified,
    role: userSnapshot.exists() ? userSnapshot.data().role : 'teacher',
  }
}

export async function saveFirebaseEducatorAccount(account) {
  const teacherId = currentUserId()
  const baseProfile = {
    displayName: account.displayName,
    email: account.email,
    emailVerified: auth.currentUser.emailVerified,
    role: 'teacher',
    language: account.language ?? 'English',
    createdAt: serverTimestamp(),
  }

  await setDoc(doc(db, 'users', teacherId), baseProfile, { merge: true })
  await setDoc(
    doc(db, 'teachers', teacherId),
    {
      schoolName: account.schoolName ?? account.school,
      countryRegion: account.countryRegion ?? account.region,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return { id: teacherId, ...baseProfile }
}

export async function saveFirebaseTeacherProfile(profile) {
  const teacherId = currentUserId()
  await setDoc(
    doc(db, 'teachers', teacherId),
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function saveFirebaseTeacherExperience(experience) {
  const teacherId = currentUserId()
  await setDoc(
    doc(db, 'teachers', teacherId),
    {
      experience,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function createFirebaseClassroom(classroom) {
  const teacherId = currentUserId()
  const joinCode = makeJoinCode(classroom.name)
  const classroomRef = doc(collection(db, 'classrooms'))
  const batch = writeBatch(db)
  const classroomData = {
    ...classroom,
    teacherId,
    joinCode,
    inviteLink: `https://factorialn.academy/join/${joinCode}`,
    studentIds: [],
    students: 0,
    progress: 0,
    upcoming: 'Invite students to begin',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  batch.set(classroomRef, classroomData)
  batch.set(doc(db, 'classroomJoinCodes', joinCode), {
    classroomId: classroomRef.id,
    teacherId,
    classroomName: classroom.name,
    createdAt: serverTimestamp(),
  })
  await batch.commit()

  return {
    id: classroomRef.id,
    ...classroomData,
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
  if (!canUseFirebase()) {
    throw new Error('Firebase is not configured.')
  }

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

export async function getFirebaseModulesByClassroom(classroomId) {
  if (!canUseFirebase()) {
    throw new Error('Firebase is not configured.')
  }

  const modulesQuery = query(
    collection(db, 'modules'),
    where('classroomId', '==', classroomId),
  )
  const snapshot = await getDocs(modulesQuery)

  return snapshot.docs.map((moduleDoc) => ({
    id: moduleDoc.id,
    ...moduleDoc.data(),
  }))
}

export async function createFirebaseModule(module) {
  const teacherId = currentUserId()
  const moduleRef = await addDoc(collection(db, 'modules'), {
    ...module,
    teacherId,
    lessons: module.lessons ?? [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    id: moduleRef.id,
    ...module,
    teacherId,
    lessons: module.lessons ?? [],
  }
}

export async function getFirebaseAssignmentsByClassroom(classroomId) {
  if (!canUseFirebase()) {
    throw new Error('Firebase is not configured.')
  }

  const assignmentsQuery = query(
    collection(db, 'assignments'),
    where('classroomId', '==', classroomId),
  )
  const snapshot = await getDocs(assignmentsQuery)

  return snapshot.docs.map((assignmentDoc) => ({
    id: assignmentDoc.id,
    ...assignmentDoc.data(),
  }))
}

export async function createFirebaseAssignment(assignment) {
  const teacherId = currentUserId()
  const assignmentRef = doc(collection(db, 'assignments'))
  const resourceFiles = assignment.resourceFiles ?? []
  const uploadedResources = await Promise.all(
    resourceFiles.map(async (file) => {
      const filePath = `classrooms/${assignment.classroomId}/assignments/${assignmentRef.id}/${file.name}`
      const fileRef = ref(storage, filePath)
      await uploadBytes(fileRef, file)

      return {
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        path: filePath,
        url: await getDownloadURL(fileRef),
      }
    }),
  )

  const assignmentData = {
    ...assignment,
    resourceFiles: [],
    uploadedResources,
    teacherId,
    submissions: 0,
    status: 'Assigned',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await setDoc(assignmentRef, assignmentData)

  return {
    id: assignmentRef.id,
    ...assignmentData,
  }
}

export async function getFirebaseAnalyticsByClassroom(classroomId, seedAnalytics) {
  if (!canUseFirebase()) {
    throw new Error('Firebase is not configured.')
  }

  const analyticsRef = doc(db, 'analytics', classroomId)
  const snapshot = await getDoc(analyticsRef)

  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    }
  }

  const teacherId = currentUserId()
  const analyticsData = {
    classroomId,
    teacherId,
    ...seedAnalytics,
    seeded: true,
    updatedAt: serverTimestamp(),
  }

  await setDoc(analyticsRef, analyticsData)

  return {
    id: classroomId,
    ...analyticsData,
  }
}
