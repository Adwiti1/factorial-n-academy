import { saveFirebaseTeacherProfile } from './firebaseTeacher.js'
import { requireMockFallback } from './mockFallback.js'
import { saveTeacherProfile as saveMockTeacherProfile } from './mockTeacher.js'

export async function saveTeacherProfile(profile) {
  try {
    await saveFirebaseTeacherProfile(profile)
    return {
      source: 'firebase',
      profile,
    }
  } catch (error) {
    requireMockFallback(error, 'Teacher profile save failed')

    return {
      source: 'mock',
      profile: saveMockTeacherProfile(profile),
    }
  }
}
