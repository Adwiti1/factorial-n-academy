const STORAGE_KEY = 'factorial-n-academy:teacher'

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
  classrooms: [
    {
      id: 'robotics-8a',
      name: 'Robotics 8A',
      students: 28,
      progress: 74,
      upcoming: 'Sensor maze challenge',
      subject: 'Robotics',
      grade: 'Grade 7-9',
      joinCode: 'ROBO8A',
    },
    {
      id: 'python-beginners',
      name: 'Python Beginners',
      students: 22,
      progress: 68,
      upcoming: 'Loops mini quiz',
      subject: 'Coding',
      grade: 'Grade 7-9',
      joinCode: 'PYLOOP',
    },
    {
      id: 'stem-club',
      name: 'STEM Club',
      students: 34,
      progress: 81,
      upcoming: 'Drone design sprint',
      subject: 'Engineering',
      grade: 'Grade 10-12',
      joinCode: 'STEM34',
    },
  ],
  modules: [
    {
      id: 'module-1',
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
    },
    {
      id: 'module-2',
      title: 'Module 2',
      lessons: [
        {
          title: 'Mission Map Challenge',
          description: 'Teams plan an automated route through obstacles.',
          time: '50 min',
        },
      ],
    },
  ],
  assignments: [
    {
      id: 'assignment-1',
      title: 'Build a Rescue Robot Brief',
      dueDate: 'Friday',
      submissions: 18,
      status: 'Draft rubric ready',
    },
  ],
  analytics: {
    completionRate: 76,
    activeStudents: 84,
    quizAverage: 82,
    aiTutorUsage: 41,
  },
}

function readState() {
  const savedState = window.localStorage.getItem(STORAGE_KEY)
  return savedState ? JSON.parse(savedState) : defaultState
}

function writeState(nextState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  return nextState
}

export function getTeacherState() {
  return readState()
}

export function getClassroomById(classroomId) {
  return readState().classrooms.find((classroom) => classroom.id === classroomId)
}

export function saveEducatorAccount(account) {
  const state = readState()
  return writeState({
    ...state,
    educator: {
      id: crypto.randomUUID(),
      ...account,
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
