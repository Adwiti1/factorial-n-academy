import {
  createFirebaseStudentAccount,
  loginFirebaseStudent,
} from './firebaseStudent.js'
import {
  loginUser,
  signupUser,
} from './mockAuth.js'
import { requireMockFallback } from './mockFallback.js'

export async function signupStudent(account) {
  try {
    const user = await createFirebaseStudentAccount(account)

    return {
      source: 'firebase',
      user,
    }
  } catch (error) {
    requireMockFallback(error, 'Student signup failed')

    return {
      source: 'mock',
      user: signupUser({
        ...account,
        role: 'student',
      }),
    }
  }
}

export async function loginStudent(credentials) {
  try {
    const user = await loginFirebaseStudent(credentials)

    return {
      source: 'firebase',
      user,
    }
  } catch (error) {
    requireMockFallback(error, 'Student login failed')

    return {
      source: 'mock',
      user: loginUser({
        ...credentials,
        role: 'student',
      }),
    }
  }
}
