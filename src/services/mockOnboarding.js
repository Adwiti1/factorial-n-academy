const STORAGE_KEY = 'factorial-n-academy:onboarding'

export function getOnboardingState() {
  const savedState = window.localStorage.getItem(STORAGE_KEY)
  return savedState ? JSON.parse(savedState) : {}
}

export function saveOnboardingState(nextState) {
  const state = {
    ...getOnboardingState(),
    ...nextState,
    updatedAt: new Date().toISOString(),
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  return state
}
