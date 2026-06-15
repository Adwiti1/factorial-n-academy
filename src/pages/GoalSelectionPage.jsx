import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { saveStudentGoals } from '../services/studentOnboarding.js'

const goals = [
  {
    id: '5',
    title: '5',
    detail: 'minutes weekly',
  },
  {
    id: '10',
    title: '10',
    detail: 'minutes weekly',
  },
  {
    id: '20',
    title: '20',
    detail: 'minutes weekly',
  },
]

function GoalSelectionPage() {
  const navigate = useNavigate()
  const [selectedGoal, setSelectedGoal] = useState('10')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleContinue() {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await saveStudentGoals({ weeklyGoalMinutes: selectedGoal })
      navigate('/student/dashboard')
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell showBrand showLanguageBar={false} topAction={<Link to="/">Skip</Link>}>
      <section className="wide-card goal-card" aria-labelledby="goal-title">
        <div className="page-heading">
          <p>We&apos;ll gently nudge you when it&apos;s time.</p>
          <h1 id="goal-title">How much time can you study daily?</h1>
        </div>

        <div className="goal-options" role="radiogroup" aria-label="Daily study goal">
          {goals.map((goal) => (
            <button
              aria-checked={selectedGoal === goal.id}
              className="goal-option"
              key={goal.id}
              onClick={() => setSelectedGoal(goal.id)}
              role="radio"
              type="button"
            >
              <strong>{goal.title}</strong>
              <span>{goal.detail}</span>
            </button>
          ))}
        </div>

        <PrimaryButton disabled={isSubmitting} onClick={handleContinue} type="button">
          {isSubmitting ? 'Saving...' : 'Continue'}
        </PrimaryButton>
        {errorMessage && <p className="microcopy">{errorMessage}</p>}
      </section>
    </AppShell>
  )
}

export default GoalSelectionPage
