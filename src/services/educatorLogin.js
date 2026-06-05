import { loginFirebaseEducator } from './firebaseTeacher.js'
import { loginUser } from './mockAuth.js'

export async function loginEducator(credentials) {
  try {
    const user = await loginFirebaseEducator(credentials)
    return {
      source: 'firebase',
      user,
    }
  } catch (error) {
    console.warn('Using mock educator login fallback:', error.message)

    return {
      source: 'mock',
      user: loginUser(credentials),
    }
  }
}
