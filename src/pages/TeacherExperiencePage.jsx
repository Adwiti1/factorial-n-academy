import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import { saveTeacherExperience } from '../services/teacherExperience.js'

const levels = [
  ['Beginner', 'New to STEM teaching', 'Guided classroom setup'],
  ['Intermediate', 'Comfortable with STEM tools', 'Moderate customization'],
  ['Advanced', 'Experienced educator', 'Full platform flexibility'],
]

function TeacherExperiencePage() {
  const [level, setLevel] = useState('Intermediate')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleContinue(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSubmitting(true)
    await saveTeacherExperience({
      level,
      certification: formData.get('certification'),
    })

    setIsSubmitting(false)
    navigate('/teacher-tutorial')
  }

  return (
    <AppShell showBrand showLanguageBar={false} topAction={<Link to="/teacher-tutorial">Skip</Link>}>
      <section className="teacher-onboarding-stack">
        <ProgressSteps currentStep={2} steps={['Briefing', 'Profile', 'Experience', 'Training']} />
        <section className="wide-card experience-card" aria-labelledby="experience-title">
          <div className="page-heading">
            <h1 id="experience-title">What best describes your STEM teaching experience?</h1>
            <p>We&apos;ll tailor onboarding and classroom recommendations.</p>
          </div>
          <form onSubmit={handleContinue}>
            <div className="experience-options" role="radiogroup" aria-label="STEM teaching experience">
              {levels.map(([title, detail, support]) => (
                <button
                  aria-checked={level === title}
                  className="experience-option"
                  key={title}
                  onClick={() => setLevel(title)}
                  role="radio"
                  type="button"
                >
                  <strong>{title}</strong>
                  <span>{detail}</span>
                  <small>{support}</small>
                </button>
              ))}
            </div>

            <label className="field certification-field" htmlFor="certification">
              <span>Degree / Certification</span>
              <select id="certification" name="certification" defaultValue="B.Ed">
                <option>B.Ed</option>
                <option>Computer Science</option>
                <option>Engineering</option>
                <option>Self-Taught</option>
                <option>Other</option>
              </select>
            </label>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Continue'}
            </PrimaryButton>
          </form>
        </section>
      </section>
    </AppShell>
  )
}

export default TeacherExperiencePage
