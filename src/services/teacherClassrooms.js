import {
  createFirebaseClassroom,
  getFirebaseClassroomById,
  getFirebaseTeacherClassrooms,
} from './firebaseTeacher.js'
import {
  createClassroom as createMockClassroom,
  getClassroomById as getMockClassroomById,
  getTeacherState,
} from './mockTeacher.js'
import { requireMockFallback } from './mockFallback.js'

function normalizeClassroom(classroom) {
  return {
    students: classroom.students ?? classroom.studentIds?.length ?? 0,
    progress: classroom.progress ?? 0,
    upcoming: classroom.upcoming ?? 'Invite students to begin',
    ...classroom,
  }
}

export async function getTeacherClassroomState() {
  try {
    const classrooms = await getFirebaseTeacherClassrooms()

    return {
      source: 'firebase',
      state: {
        ...getTeacherState(),
        classrooms: classrooms.map(normalizeClassroom),
      },
    }
  } catch (error) {
    requireMockFallback(error, 'Classroom list load failed')

    return {
      source: 'mock',
      state: getTeacherState(),
    }
  }
}

export async function createTeacherClassroom(classroom) {
  try {
    const nextClassroom = await createFirebaseClassroom(classroom)

    return {
      source: 'firebase',
      classroom: normalizeClassroom(nextClassroom),
    }
  } catch (error) {
    requireMockFallback(error, 'Classroom create failed')

    const nextState = createMockClassroom(classroom)
    return {
      source: 'mock',
      state: nextState,
      classroom: nextState.classrooms[0],
    }
  }
}

export async function getTeacherClassroomById(classroomId) {
  try {
    const classroom = await getFirebaseClassroomById(classroomId)

    if (!classroom) {
      return {
        source: 'firebase',
        classroom: null,
      }
    }

    return {
      source: 'firebase',
      classroom: normalizeClassroom(classroom),
    }
  } catch (error) {
    requireMockFallback(error, 'Classroom detail load failed')

    return {
      source: 'mock',
      classroom: getMockClassroomById(classroomId) ?? null,
    }
  }
}
