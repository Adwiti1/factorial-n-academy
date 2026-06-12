const CURRENT_USER_KEY = 'factorial-n-academy:user'
const ACCOUNTS_KEY = 'factorial-n-academy:mock-accounts'

function readAccounts() {
  return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || '[]')
}

function writeAccounts(accounts) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function accountKey({ email, role }) {
  return `${role}:${email.trim().toLowerCase()}`
}

function encodePassword(password) {
  return window.btoa(password)
}

export function getCurrentUser() {
  const savedUser = window.localStorage.getItem(CURRENT_USER_KEY)
  return savedUser ? JSON.parse(savedUser) : null
}

export function signupUser({ displayName, email, password, role = 'student' }) {
  const accounts = readAccounts()
  const key = accountKey({ email, role })
  const existingAccount = accounts.find((account) => account.key === key)

  if (existingAccount) {
    throw new Error('An account with this email already exists.')
  }

  const user = {
    id: crypto.randomUUID(),
    key,
    displayName,
    email: email.trim().toLowerCase(),
    passwordHash: encodePassword(password),
    role,
    createdAt: new Date().toISOString(),
  }

  writeAccounts([user, ...accounts])
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))

  return {
    ...user,
    passwordHash: undefined,
  }
}

export function loginUser({ email, password, role = 'student' }) {
  const accounts = readAccounts()
  const key = accountKey({ email, role })
  const existingUser = accounts.find((account) => account.key === key)

  if (!existingUser) {
    throw new Error('No account found for this email.')
  }

  if (existingUser.passwordHash !== encodePassword(password)) {
    throw new Error('Incorrect password.')
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existingUser))

  return {
    ...existingUser,
    passwordHash: undefined,
  }
}
