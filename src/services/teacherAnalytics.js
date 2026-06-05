import { getFirebaseAnalyticsByClassroom } from './firebaseTeacher.js'
import { getTeacherState } from './mockTeacher.js'

const seededAnalytics = {
  summary: {
    students: 28,
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
}

function mockAnalytics(classroomId) {
  const { analytics, classrooms } = getTeacherState()
  const classroom = classrooms.find((item) => item.id === classroomId) ?? classrooms[0]

  return {
    ...seededAnalytics,
    summary: {
      students: classroom.students,
      completionRate: analytics.completionRate,
      quizAverage: analytics.quizAverage,
    },
  }
}

export async function getTeacherAnalytics(classroomId) {
  try {
    const analytics = await getFirebaseAnalyticsByClassroom(classroomId, seededAnalytics)

    return {
      source: 'firebase',
      analytics,
    }
  } catch (error) {
    console.warn('Using mock analytics fallback:', error.message)

    return {
      source: 'mock',
      analytics: mockAnalytics(classroomId),
    }
  }
}
