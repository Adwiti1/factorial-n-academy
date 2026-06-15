import {
  sendAccountPasswordReset,
  sendCurrentUserVerification,
  updateCurrentAccountEmail,
  updateCurrentAccountPassword,
} from './firebaseAccount.js'
import { requireMockFallback } from './mockFallback.js'

const MOCK_ACCOUNT_KEY = 'factorial-n-academy:account-actions'

function saveMockAction(action) {
  const savedActions = JSON.parse(window.localStorage.getItem(MOCK_ACCOUNT_KEY) || '[]')
  const nextActions = [
    {
      ...action,
      createdAt: new Date().toISOString(),
    },
    ...savedActions,
  ]

  window.localStorage.setItem(MOCK_ACCOUNT_KEY, JSON.stringify(nextActions))
  return nextActions[0]
}

export async function requestPasswordReset(email) {
  try {
    await sendAccountPasswordReset(email)
    return { source: 'firebase' }
  } catch (error) {
    requireMockFallback(error, 'Password reset failed')

    return {
      source: 'mock',
      action: saveMockAction({
        type: 'password-reset',
        email,
      }),
    }
  }
}

export async function requestEmailVerification() {
  try {
    await sendCurrentUserVerification()
    return { source: 'firebase' }
  } catch (error) {
    requireMockFallback(error, 'Email verification request failed')

    return {
      source: 'mock',
      action: saveMockAction({
        type: 'email-verification',
      }),
    }
  }
}

export async function changeAccountEmail(email) {
  try {
    await updateCurrentAccountEmail(email)
    return { source: 'firebase' }
  } catch (error) {
    requireMockFallback(error, 'Email update failed')

    return {
      source: 'mock',
      action: saveMockAction({
        type: 'email-update',
        email,
      }),
    }
  }
}

export async function changeAccountPassword(password) {
  try {
    await updateCurrentAccountPassword(password)
    return { source: 'firebase' }
  } catch (error) {
    requireMockFallback(error, 'Password update failed')

    return {
      source: 'mock',
      action: saveMockAction({
        type: 'password-update',
      }),
    }
  }
}
