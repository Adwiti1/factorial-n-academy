import { createFirebaseEducatorAccount } from './firebaseTeacher.js'
import { saveEducatorAccount } from './mockTeacher.js'

function saveMockEducatorAccount(account) {
  return saveEducatorAccount({
    displayName: account.displayName,
    email: account.email,
    passwordLength: account.password.length,
    school: account.schoolName,
    region: account.countryRegion,
  })
}

export async function signupEducator(account) {
  try {
    const user = await createFirebaseEducatorAccount(account)
    return {
      source: 'firebase',
      user,
    }
  } catch (error) {
    console.warn('Using mock educator signup fallback:', error.message)

    return {
      source: 'mock',
      user: saveMockEducatorAccount(account),
    }
  }
}
