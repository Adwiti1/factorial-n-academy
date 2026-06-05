import { saveFirebaseTeacherExperience } from './firebaseTeacher.js'
import { saveTeacherExperience as saveMockTeacherExperience } from './mockTeacher.js'

export async function saveTeacherExperience(experience) {
  try {
    await saveFirebaseTeacherExperience(experience)
    return {
      source: 'firebase',
      experience,
    }
  } catch (error) {
    console.warn('Using mock teacher experience fallback:', error.message)

    return {
      source: 'mock',
      experience: saveMockTeacherExperience(experience),
    }
  }
}
