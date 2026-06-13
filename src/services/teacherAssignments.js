import {
  createFirebaseAssignment,
  getFirebaseAssignmentsByClassroom,
} from './firebaseTeacher.js'
import {
  createAssignment as createMockAssignment,
  getTeacherState,
} from './mockTeacher.js'
import { requireMockFallback } from './mockFallback.js'

function normalizeAssignment(assignment) {
  return {
    submissions: assignment.submissions ?? 0,
    status: assignment.status ?? 'Assigned',
    resources: assignment.resources ?? [],
    uploadedResources: assignment.uploadedResources ?? [],
    ...assignment,
  }
}

export async function getTeacherAssignments(classroomId) {
  try {
    const assignments = await getFirebaseAssignmentsByClassroom(classroomId)

    return {
      source: 'firebase',
      assignments: assignments.map(normalizeAssignment),
    }
  } catch (error) {
    requireMockFallback(error, 'Assignment list load failed')

    return {
      source: 'mock',
      assignments: getTeacherState().assignments,
    }
  }
}

export async function createTeacherAssignment(assignment) {
  try {
    const nextAssignment = await createFirebaseAssignment(assignment)

    return {
      source: 'firebase',
      assignment: normalizeAssignment(nextAssignment),
    }
  } catch (error) {
    requireMockFallback(error, 'Assignment create failed')

    const nextState = createMockAssignment({
      ...assignment,
      resourceFiles: [],
      uploadedResources: assignment.resourceFiles?.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })) ?? [],
    })
    return {
      source: 'mock',
      state: nextState,
      assignment: nextState.assignments[0],
    }
  }
}
