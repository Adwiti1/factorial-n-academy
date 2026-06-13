const ACTIVE_TEACHER_KEY = 'factorial-n-academy:active-teacher'
const STORAGE_PREFIX = 'factorial-n-academy:teacher'

const defaultState = {
  educator: null,
  profile: {
    grades: '',
    subjects: ['Robotics', 'Coding'],
    focusAreas: '',
  },
  experience: {
    level: 'Intermediate',
    certification: 'B.Ed',
  },
  classrooms: [],
  modules: [],
  assignments: [],
  analytics: {
    completionRate: 0,
    activeStudents: 0,
    quizAverage: 0,
    aiTutorUsage: 0,
  },
}

function accountIdFromEmail(email) {
  return email ? email.trim().toLowerCase() : 'guest-teacher'
}

function storageKey() {
  const activeTeacherId = window.localStorage.getItem(ACTIVE_TEACHER_KEY) || 'guest-teacher'
  return `${STORAGE_PREFIX}:${activeTeacherId}`
}

function readState() {
  const savedState = window.localStorage.getItem(storageKey())
  return savedState ? JSON.parse(savedState) : defaultState
}

function writeState(nextState) {
  window.localStorage.setItem(storageKey(), JSON.stringify(nextState))
  return nextState
}

export function getTeacherState() {
  return readState()
}

export function getClassroomById(classroomId) {
  return readState().classrooms.find((classroom) => classroom.id === classroomId)
}

export function saveEducatorAccount(account) {
  const educatorId = accountIdFromEmail(account.email)
  window.localStorage.setItem(ACTIVE_TEACHER_KEY, educatorId)

  const state = readState()
  return writeState({
    ...state,
    educator: {
      id: educatorId,
      ...account,
      createdAt: new Date().toISOString(),
    },
  })
}

export function activateEducatorAccount(email) {
  const educatorId = accountIdFromEmail(email)
  window.localStorage.setItem(ACTIVE_TEACHER_KEY, educatorId)

  const state = readState()

  if (state.educator) {
    return state
  }

  return writeState({
    ...state,
    educator: {
      id: educatorId,
      displayName: 'Educator',
      email,
      createdAt: new Date().toISOString(),
    },
  })
}

export function saveTeacherProfile(profile) {
  const state = readState()
  return writeState({
    ...state,
    profile: {
      ...state.profile,
      ...profile,
    },
  })
}

export function saveTeacherExperience(experience) {
  const state = readState()
  return writeState({
    ...state,
    experience: {
      ...state.experience,
      ...experience,
    },
  })
}

export function createClassroom(classroom) {
  const state = readState()
  const joinCode = classroom.name
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 6)
    .toUpperCase()
    .padEnd(6, 'X')

  const nextClassroom = {
    id: crypto.randomUUID(),
    studentIds: classroom.studentIds ?? [],
    students: 0,
    progress: 0,
    upcoming: 'Invite students to begin',
    joinCode,
    inviteLink: `https://factorialn.academy/join/${joinCode}`,
    ...classroom,
  }

  return writeState({
    ...state,
    classrooms: [nextClassroom, ...state.classrooms],
  })
}

export function createAssignment(assignment) {
  const state = readState()
  const nextAssignment = {
    id: crypto.randomUUID(),
    submissions: 0,
    status: 'Assigned',
    ...assignment,
  }

  return writeState({
    ...state,
    assignments: [nextAssignment, ...state.assignments],
  })
}
