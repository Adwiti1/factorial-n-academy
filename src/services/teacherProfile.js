import { saveFirebaseTeacherProfile } from './firebaseTeacher.js'
import { saveTeacherProfile as saveMockTeacherProfile } from './mockTeacher.js'

export async function saveTeacherProfile(profile) {
  try {
    await saveFirebaseTeacherProfile(profile)
    return {
      source: 'firebase',
      profile,
    }
  } catch (error) {
    console.warn('Using mock teacher profile fallback:', error.message)

    return {
      source: 'mock',
      profile: saveMockTeacherProfile(profile),
    }
  }
}
