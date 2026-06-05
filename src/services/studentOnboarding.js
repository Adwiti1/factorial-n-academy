import {
  saveFirebaseStudentGoals,
  saveFirebaseStudentOnboarding,
} from './firebaseStudent.js'
import { saveOnboardingState } from './mockOnboarding.js'

export async function saveStudentOnboarding(onboarding) {
  try {
    const savedOnboarding = await saveFirebaseStudentOnboarding(onboarding)

    return {
      source: 'firebase',
      onboarding: savedOnboarding,
    }
  } catch (error) {
    console.warn('Using mock student onboarding fallback:', error.message)

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
    console.warn('Using mock student goals fallback:', error.message)

    return {
      source: 'mock',
      goals: saveOnboardingState(goals),
    }
  }
}
