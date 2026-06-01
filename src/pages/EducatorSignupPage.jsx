import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import FormField from '../components/FormField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { saveEducatorAccount } from '../services/mockTeacher.js'

function EducatorSignupPage() {
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    saveEducatorAccount({
      displayName: formData.get('displayName'),
      email: formData.get('email'),
      passwordLength: formData.get('password').length,
      school: formData.get('school'),
      region: formData.get('region'),
    })

    navigate('/intro')
  }

  return (
    <AppShell>
      <section className="educator-signup-grid">
        <div className="signup-panel">
          <div className="academy-badge" aria-hidden="true">
            <span>FN</span>
          </div>
          <div className="card-heading teacher-heading">
            <h1>Create Educator Account</h1>
          </div>
          <form className="auth-form educator-auth-form" onSubmit={handleSubmit}>
            <FormField id="displayName" label="Display Name" name="displayName" required />
            <FormField id="email" label="Email" name="email" required type="email" />
            <FormField id="password" label="Password" name="password" required type="password" />
            <FormField id="school" label="School / Institution Name" name="school" required />
            <label className="field" htmlFor="region">
              <span>Country/Region</span>
              <select id="region" name="region" defaultValue="Canada">
                <option>Canada</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Other</option>
              </select>
            </label>
            <PrimaryButton type="submit">Create Educator Account</PrimaryButton>
          </form>
          <p className="microcopy">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </AppShell>
  )
}

export default EducatorSignupPage
