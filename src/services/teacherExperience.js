import { saveFirebaseTeacherExperience } from './firebaseTeacher.js'
import { requireMockFallback } from './mockFallback.js'
import { saveTeacherExperience as saveMockTeacherExperience } from './mockTeacher.js'

export async function saveTeacherExperience(experience) {
  try {
    await saveFirebaseTeacherExperience(experience)
    return {
      source: 'firebase',
      experience,
    }
  } catch (error) {
    requireMockFallback(error, 'Teacher experience save failed')

    return {
      source: 'mock',
      experience: saveMockTeacherExperience(experience),
    }
  }
}
