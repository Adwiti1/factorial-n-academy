import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import {
  auth,
  db,
  isFirebaseConfigured,
  storage,
} from '../lib/firebase.js'

async function requireStudent() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured.')
  }

  await auth.authStateReady()

  if (!auth.currentUser) {
    throw new Error('Please sign in to view your dashboard.')
  }

  return auth.currentUser
}

async function getClassroomItems(collectionName, classroomId) {
  const itemsQuery = query(
    collection(db, collectionName),
    where('classroomId', '==', classroomId),
  )
  const snapshot = await getDocs(itemsQuery)

  return snapshot.docs.map((itemDoc) => ({
    id: itemDoc.id,
    ...itemDoc.data(),
  }))
}

export async function getFirebaseStudentDashboard() {
  const currentUser = await requireStudent()
  const userSnapshot = await getDoc(doc(db, 'users', currentUser.uid))
  const classroomsQuery = query(
    collection(db, 'classrooms'),
    where('studentIds', 'array-contains', currentUser.uid),
  )
  const classroomSnapshot = await getDocs(classroomsQuery)
  const classrooms = classroomSnapshot.docs.map((classroomDoc) => ({
    id: classroomDoc.id,
    ...classroomDoc.data(),
  }))

  const classroomContent = await Promise.all(
    classrooms.map(async (classroom) => ({
      classroomId: classroom.id,
      modules: await getClassroomItems('modules', classroom.id),
      assignments: await getClassroomItems('assignments', classroom.id),
    })),
  )

  const submissionsQuery = query(
    collection(db, 'submissions'),
    where('studentId', '==', currentUser.uid),
  )
  const submissionSnapshot = await getDocs(submissionsQuery)

  return {
    student: {
      id: currentUser.uid,
      displayName: userSnapshot.data()?.displayName
        ?? currentUser.displayName
        ?? 'Student',
    },
    classrooms,
    modules: classroomContent.flatMap((item) => item.modules),
    assignments: classroomContent.flatMap((item) => item.assignments),
    submissions: submissionSnapshot.docs.map((submissionDoc) => ({
      id: submissionDoc.id,
      ...submissionDoc.data(),
    })),
  }
}

export async function joinFirebaseClassroom(joinCode) {
  const currentUser = await requireStudent()
  const normalizedCode = joinCode.trim().toUpperCase()

  if (!normalizedCode) {
    throw new Error('Enter a classroom join code.')
  }

  const joinCodeSnapshot = await getDoc(doc(db, 'classroomJoinCodes', normalizedCode))

  if (!joinCodeSnapshot.exists()) {
    throw new Error('That classroom code was not found.')
  }

  const { classroomId } = joinCodeSnapshot.data()

  await updateDoc(doc(db, 'classrooms', classroomId), {
    studentIds: arrayUnion(currentUser.uid),
    students: increment(1),
    updatedAt: serverTimestamp(),
  })

  return classroomId
}

export async function submitFirebaseAssignment({
  assignmentId,
  classroomId,
  files = [],
  response = '',
}) {
  const currentUser = await requireStudent()
  const assignmentSnapshot = await getDoc(doc(db, 'assignments', assignmentId))

  if (!assignmentSnapshot.exists()) {
    throw new Error('This assignment no longer exists.')
  }

  if (assignmentSnapshot.data().classroomId !== classroomId) {
    throw new Error('This assignment does not belong to the selected classroom.')
  }

  const submissionId = `${assignmentId}_${currentUser.uid}`
  const submissionRef = doc(db, 'submissions', submissionId)

  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const filePath = `classrooms/${classroomId}/submissions/${currentUser.uid}/${assignmentId}/${file.name}`
      const fileRef = ref(storage, filePath)
      await uploadBytes(fileRef, file)

      return {
        name: file.name,
        path: filePath,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: await getDownloadURL(fileRef),
      }
    }),
  )

  const submission = {
    assignmentId,
    classroomId,
    studentId: currentUser.uid,
    response: response.trim(),
    uploadedFiles,
    status: 'Submitted',
    submittedAt: serverTimestamp(),
  }

  try {
    await setDoc(submissionRef, submission)
  } catch (error) {
    if (error.code === 'permission-denied') {
      throw new Error(
        'You already submitted this assignment or no longer have access.',
        { cause: error },
      )
    }

    throw error
  }

  return {
    id: submissionId,
    ...submission,
  }
}
