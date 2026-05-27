import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import SelectField from '../components/SelectField.jsx'
import { saveOnboardingState } from '../services/mockOnboarding.js'

function OnboardingPage() {
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    saveOnboardingState({
      age: formData.get('age'),
      grade: formData.get('grade'),
      experience: formData.get('experience'),
    })

    navigate('/goals')
  }

  return (
    <AppShell showBrand showLanguageBar={false} topAction={<Link to="/goals">Skip</Link>}>
      <section className="wide-card onboarding-card" aria-labelledby="onboarding-title">
        <div className="page-heading">
          <p>The fields are optional to help us personalize your experience.</p>
          <h1 id="onboarding-title">Tell us about yourself</h1>
        </div>

        <form className="choice-form" onSubmit={handleSubmit}>
          <SelectField icon="A" id="age" label="Age" name="age" defaultValue="">
            <option value="" disabled>
              Select your age range
            </option>
            <option value="under-13">Under 13</option>
            <option value="13-15">13-15</option>
            <option value="16-18">16-18</option>
            <option value="adult">Adult learner</option>
          </SelectField>

          <SelectField icon="G" id="grade" label="Grade" name="grade" defaultValue="">
            <option value="" disabled>
              Select your grade
            </option>
            <option value="middle-school">Middle school</option>
            <option value="high-school">High school</option>
            <option value="college">College</option>
            <option value="self-study">Self study</option>
          </SelectField>

          <SelectField icon="E" id="experience" label="Experience level" name="experience" defaultValue="">
            <option value="" disabled>
              Select your experience
            </option>
            <option value="new">New to math enrichment</option>
            <option value="some">Some contest practice</option>
            <option value="advanced">Advanced problem solver</option>
          </SelectField>

          <PrimaryButton type="submit">Continue</PrimaryButton>
        </form>
      </section>
    </AppShell>
  )
}

export default OnboardingPage
