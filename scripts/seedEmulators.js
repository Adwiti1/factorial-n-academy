const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'demo-factorial-n-academy'
const AUTH_EMULATOR = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099'
const FIRESTORE_EMULATOR = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080'
const API_KEY = 'demo-key'

const teacher = {
  email: 'teacher@factorialn.test',
  password: 'password123',
  displayName: 'Demo Educator',
}

const students = [
  {
    email: 'student1@factorialn.test',
    password: 'password123',
    displayName: 'Ava Student',
  },
  {
    email: 'student2@factorialn.test',
    password: 'password123',
    displayName: 'Noah Student',
  },
  {
    email: 'student3@factorialn.test',
    password: 'password123',
    displayName: 'Maya Student',
  },
]

function firestoreBaseUrl() {
  return `http://${FIRESTORE_EMULATOR}/v1/projects/${PROJECT_ID}/databases/(default)/documents`
}

function encodePath(path) {
  return path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}

function toFirestoreValue(value) {
  if (value === null || value === undefined) {
    return { nullValue: null }
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(toFirestoreValue),
      },
    }
  }

  if (value instanceof Date) {
    return { timestampValue: value.toISOString() }
  }

  if (typeof value === 'object') {
    return {
      mapValue: {
        fields: toFirestoreFields(value),
      },
    }
  }

  if (typeof value === 'boolean') {
    return { booleanValue: value }
  }

  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { integerValue: value }
      : { doubleValue: value }
  }

  return { stringValue: String(value) }
}

function toFirestoreFields(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, toFirestoreValue(value)]),
  )
}

async function firebaseRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${text}`)
  }

  return response.json()
}

async function signUpOrSignIn({ email, password, displayName }) {
  const signUpUrl = `http://${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`

  try {
    const account = await firebaseRequest(signUpUrl, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        displayName,
        returnSecureToken: true,
      }),
    })

    return {
      id: account.localId,
      token: account.idToken,
    }
  } catch (error) {
    if (!error.message.includes('EMAIL_EXISTS')) {
      throw error
    }

    const signInUrl = `http://${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
    const account = await firebaseRequest(signInUrl, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    })

    return {
      id: account.localId,
      token: account.idToken,
    }
  }
}

async function writeDocument(path, data, idToken) {
  const url = `${firestoreBaseUrl()}/${encodePath(path)}`
  return firebaseRequest(url, {
    method: 'PATCH',
    headers: idToken
      ? {
          Authorization: `Bearer ${idToken}`,
        }
      : undefined,
    body: JSON.stringify({
      fields: toFirestoreFields(data),
    }),
  })
}

async function seed() {
  console.log(`Seeding Firebase emulators for project ${PROJECT_ID}...`)

  const teacherAccount = await signUpOrSignIn(teacher)
  const teacherId = teacherAccount.id
  const studentAccounts = []

  for (const student of students) {
    studentAccounts.push(await signUpOrSignIn(student))
  }

  const studentIds = studentAccounts.map((studentAccount) => studentAccount.id)

  const now = new Date()
  const classroomId = 'robotics-8a'

  await writeDocument(`users/${teacherId}`, {
    displayName: teacher.displayName,
    email: teacher.email,
    role: 'teacher',
    language: 'English',
    createdAt: now,
  }, teacherAccount.token)

  await writeDocument(`teachers/${teacherId}`, {
    displayName: teacher.displayName,
    email: teacher.email,
    schoolName: 'Factorial N Demo School',
    countryRegion: 'Canada',
    grades: 'Grade 7-9',
    subjects: ['Robotics', 'Coding'],
    focusAreas: 'Robotics',
    experience: {
      level: 'Intermediate',
      certification: 'B.Ed',
    },
    updatedAt: now,
  }, teacherAccount.token)

  for (const [index, student] of students.entries()) {
    const studentAccount = studentAccounts[index]
    const studentId = studentAccount.id

    await writeDocument(`users/${studentId}`, {
      displayName: student.displayName,
      email: student.email,
      role: 'student',
      language: 'English',
      createdAt: now,
    }, studentAccount.token)

    await writeDocument(`students/${studentId}`, {
      displayName: student.displayName,
      email: student.email,
      onboarding: {
        age: index === 0 ? '13-15' : '16-18',
        grade: index === 2 ? 'high-school' : 'middle-school',
        experience: index === 0 ? 'new' : 'some',
      },
      goals: {
        weeklyGoalMinutes: index === 2 ? '20' : '10',
      },
      updatedAt: now,
    }, studentAccount.token)
  }

  await writeDocument(`classrooms/${classroomId}`, {
    teacherId,
    name: 'Robotics 8A',
    subject: 'Robotics',
    grade: 'Grade 7-9',
    joinCode: 'ROBO8A',
    inviteLink: 'https://factorialn.academy/join/ROBO8A',
    studentIds,
    students: studentIds.length,
    progress: 74,
    upcoming: 'Sensor maze challenge',
    createdAt: now,
    updatedAt: now,
  }, teacherAccount.token)

  await writeDocument('classroomJoinCodes/ROBO8A', {
    classroomId,
    teacherId,
    classroomName: 'Robotics 8A',
    createdAt: now,
  }, teacherAccount.token)

  await writeDocument('modules/module-1', {
    classroomId,
    teacherId,
    title: 'Module 1',
    lessons: [
      {
        title: 'Robotics Foundations',
        description: 'Introduce sensors, motors, and classroom safety.',
        time: '35 min',
      },
      {
        title: 'Python Control Flow',
        description: 'Use loops to control repeated robot actions.',
        time: '45 min',
      },
    ],
    createdAt: now,
    updatedAt: now,
  }, teacherAccount.token)

  await writeDocument('modules/module-2', {
    classroomId,
    teacherId,
    title: 'Module 2',
    lessons: [
      {
        title: 'Mission Map Challenge',
        description: 'Teams plan an automated route through obstacles.',
        time: '50 min',
      },
    ],
    createdAt: now,
    updatedAt: now,
  }, teacherAccount.token)

  await writeDocument('assignments/assignment-1', {
    classroomId,
    teacherId,
    title: 'Build a Rescue Robot Brief',
    instructions: 'Explain the robot mission, route, and sensor logic.',
    dueDate: 'Friday',
    moduleTitle: 'Module 1',
    resources: ['PDF', 'Code file'],
    uploadedResources: [],
    submissions: 2,
    status: 'Assigned',
    createdAt: now,
    updatedAt: now,
  }, teacherAccount.token)

  await writeDocument('quizzes/quiz-1', {
    classroomId,
    teacherId,
    title: 'Robotics Safety Quiz',
    questionCount: 8,
    average: 86,
    createdAt: now,
    updatedAt: now,
  }, teacherAccount.token)

  await writeDocument('analytics/robotics-8a', {
    classroomId,
    teacherId,
    summary: {
      students: studentIds.length,
      completionRate: 76,
      quizAverage: 82,
    },
    assignmentGrades: [
      { name: 'Rescue Robot Brief', grade: 84 },
      { name: 'Loops Mini Quiz Prep', grade: 78 },
      { name: 'Mission Map Plan', grade: 91 },
    ],
    quizGrades: [
      { name: 'Robotics Safety Quiz', grade: 86 },
      { name: 'Python Loops Quiz', grade: 72 },
      { name: 'Sensors Checkpoint', grade: 88 },
    ],
    moduleCompletion: [
      { module: 'Module 1', title: 'Robotics Foundations', completion: 88 },
      { module: 'Module 2', title: 'Mission Map Challenge', completion: 64 },
      { module: 'Module 3', title: 'Final Build Project', completion: 42 },
    ],
    seeded: true,
    updatedAt: now,
  }, teacherAccount.token)

  await writeDocument(`submissions/assignment-1_${studentIds[0]}`, {
    classroomId,
    assignmentId: 'assignment-1',
    studentId: studentIds[0],
    status: 'Submitted',
    grade: 86,
    feedback: 'Clear route plan and strong sensor explanation.',
    submittedAt: now,
  }, studentAccounts[0].token)

  await writeDocument(`submissions/assignment-1_${studentIds[1]}`, {
    classroomId,
    assignmentId: 'assignment-1',
    studentId: studentIds[1],
    status: 'Submitted',
    grade: 78,
    feedback: 'Good start. Add more detail about obstacle handling.',
    submittedAt: now,
  }, studentAccounts[1].token)

  console.log('Seed complete.')
  console.log(`Teacher login: ${teacher.email} / ${teacher.password}`)
  console.log(`Student login: ${students[0].email} / ${students[0].password}`)
}

seed().catch((error) => {
  console.error(error.message)
  console.error('Make sure the Firebase emulators are running with: npm run emulators')
  process.exit(1)
})
