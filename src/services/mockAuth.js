const STORAGE_KEY = 'factorial-n-academy:user'

export function getCurrentUser() {
  const savedUser = window.localStorage.getItem(STORAGE_KEY)
  return savedUser ? JSON.parse(savedUser) : null
}

export function signupUser({ displayName, email, password }) {
  const user = {
    id: crypto.randomUUID(),
    displayName,
    email,
    passwordLength: password.length,
    createdAt: new Date().toISOString(),
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

export function loginUser({ email }) {
  const existingUser = getCurrentUser()

  if (existingUser?.email === email) {
    return existingUser
  }

  const guestUser = {
    id: crypto.randomUUID(),
    displayName: 'Learner',
    email,
    createdAt: new Date().toISOString(),
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser))
  return guestUser
}
