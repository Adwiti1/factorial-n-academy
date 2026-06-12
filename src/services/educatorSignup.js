import { createFirebaseEducatorAccount } from './firebaseTeacher.js'
import { signupUser } from './mockAuth.js'
import { requireMockFallback } from './mockFallback.js'
import { saveEducatorAccount } from './mockTeacher.js'

function saveMockEducatorAccount(account) {
  const user = signupUser({
    displayName: account.displayName,
    email: account.email,
    password: account.password,
    role: 'teacher',
  })

  saveEducatorAccount({
    displayName: account.displayName,
    email: account.email,
    school: account.schoolName,
    region: account.countryRegion,
  })

  return user
}

export async function signupEducator(account) {
  try {
    const user = await createFirebaseEducatorAccount(account)
    return {
      source: 'firebase',
      user,
    }
  } catch (error) {
    requireMockFallback(error, 'Educator signup failed')

    return {
      source: 'mock',
      user: saveMockEducatorAccount(account),
    }
  }
}
