import {
  createFirebaseModule,
  getFirebaseModulesByClassroom,
} from './firebaseTeacher.js'
import { requireMockFallback } from './mockFallback.js'
import { getTeacherState } from './mockTeacher.js'

function normalizeModule(module) {
  return {
    lessons: module.lessons ?? [],
    ...module,
  }
}

export async function getTeacherModules(classroomId) {
  try {
    const modules = await getFirebaseModulesByClassroom(classroomId)

    return {
      source: 'firebase',
      modules: modules.map(normalizeModule),
    }
  } catch (error) {
    requireMockFallback(error, 'Module list load failed')

    return {
      source: 'mock',
      modules: getTeacherState().modules,
    }
  }
}

export async function createTeacherModule(module) {
  try {
    const nextModule = await createFirebaseModule(module)

    return {
      source: 'firebase',
      module: normalizeModule(nextModule),
    }
  } catch (error) {
    requireMockFallback(error, 'Module save failed')

    return {
      source: 'mock',
      module,
    }
  }
}
