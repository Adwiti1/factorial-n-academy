import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'
import SelectField from '../components/SelectField.jsx'
import { saveTeacherProfile } from '../services/teacherProfile.js'

const subjects = ['Robotics', 'Coding', 'Computer Science', 'Engineering', 'Mathematics', 'Science']

function TeacherProfilePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await saveTeacherProfile({
        grades: formData.get('grades'),
        subjects: formData.getAll('subjects'),
        focusAreas: formData.get('focusAreas'),
      })

      navigate('/teacher-experience')
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell showBrand showLanguageBar={false} topAction={<Link to="/teacher-experience">Skip</Link>}>
      <section className="teacher-onboarding-stack">
        <ProgressSteps currentStep={1} steps={['Briefing', 'Profile', 'Experience', 'Training']} />
        <section className="wide-card teacher-form-card" aria-labelledby="teacher-profile-title">
          <Link className="back-link" to="/intro">
            Back
          </Link>
          <div className="page-heading">
            <h1 id="teacher-profile-title">Tell us about your teaching profile</h1>
            <p>Help us personalize your classroom tools and curriculum recommendations.</p>
          </div>

          <form className="choice-form" onSubmit={handleSubmit}>
            <SelectField icon="G" id="grades" label="Grades Taught" name="grades" defaultValue="">
              <option value="" disabled>
                Select grade range
              </option>
              <option>Grade 4-6</option>
              <option>Grade 7-9</option>
              <option>Grade 10-12</option>
            </SelectField>

            <fieldset className="multi-select-field">
              <legend>Subjects Taught</legend>
              <div className="chip-grid">
                {subjects.map((subject) => (
                  <label key={subject}>
                    <input defaultChecked={subject === 'Robotics'} name="subjects" type="checkbox" value={subject} />
                    <span>{subject}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <SelectField icon="S" id="focusAreas" label="STEM Focus Areas" name="focusAreas" defaultValue="">
              <option value="" disabled>
                Select a focus area
              </option>
              <option>AI</option>
              <option>Robotics</option>
              <option>Game Development</option>
              <option>Python</option>
              <option>Electronics</option>
              <option>Drones</option>
              <option>Automation</option>
            </SelectField>

            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Continue'}
            </PrimaryButton>
            {errorMessage && <p className="microcopy">{errorMessage}</p>}
          </form>
        </section>
      </section>
    </AppShell>
  )
}

export default TeacherProfilePage
