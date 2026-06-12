import {
  saveFirebaseStudentGoals,
  saveFirebaseStudentOnboarding,
} from './firebaseStudent.js'
import { requireMockFallback } from './mockFallback.js'
import { saveOnboardingState } from './mockOnboarding.js'

export async function saveStudentOnboarding(onboarding) {
  try {
    const savedOnboarding = await saveFirebaseStudentOnboarding(onboarding)

    return {
      source: 'firebase',
      onboarding: savedOnboarding,
    }
  } catch (error) {
    requireMockFallback(error, 'Student onboarding save failed')

    return {
      source: 'mock',
      onboarding: saveOnboardingState(onboarding),
    }
  }
}

export async function saveStudentGoals(goals) {
  try {
    const savedGoals = await saveFirebaseStudentGoals(goals)

    return {
      source: 'firebase',
      goals: savedGoals,
    }
  } catch (error) {
    requireMockFallback(error, 'Student goals save failed')

    return {
      source: 'mock',
      goals: saveOnboardingState(goals),
    }
  }
}
