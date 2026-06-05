import {
  createFirebaseStudentAccount,
  loginFirebaseStudent,
} from './firebaseStudent.js'
import {
  loginUser,
  signupUser,
} from './mockAuth.js'

export async function signupStudent(account) {
  try {
    const user = await createFirebaseStudentAccount(account)

    return {
      source: 'firebase',
      user,
    }
  } catch (error) {
    console.warn('Using mock student signup fallback:', error.message)

    return {
      source: 'mock',
      user: signupUser(account),
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
    console.warn('Using mock student login fallback:', error.message)

    return {
      source: 'mock',
      user: loginUser(credentials),
    }
  }
}
