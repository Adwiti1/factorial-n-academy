import { loginFirebaseEducator } from './firebaseTeacher.js'
import { loginUser } from './mockAuth.js'
import { requireMockFallback } from './mockFallback.js'
import { activateEducatorAccount } from './mockTeacher.js'

export async function loginEducator(credentials) {
  try {
    const user = await loginFirebaseEducator(credentials)
    return {
      source: 'firebase',
      user,
    }
  } catch (error) {
    requireMockFallback(error, 'Educator login failed')
    const user = loginUser({
      ...credentials,
      role: 'teacher',
    })
    activateEducatorAccount(credentials.email)

    return {
      source: 'mock',
      user,
    }
  }
}
