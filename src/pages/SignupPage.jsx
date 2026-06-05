import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { signupStudent } from '../services/studentAuth.js'

function SignupPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSubmitting(true)
    await signupStudent({
      displayName: formData.get('displayName'),
      email: formData.get('email'),
      password: formData.get('password'),
    })

    setIsSubmitting(false)
    navigate('/student/intro')
  }

  return (
    <AppShell>
      <AuthCard>
        <div className="academy-badge" aria-hidden="true">
          <span>FN</span>
        </div>
        <div className="card-heading">
          <h1>Create Account</h1>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="displayName" label="Display Name" name="displayName" required />
          <FormField id="email" label="Email" name="email" required type="email" />
          <FormField id="password" label="Password" name="password" required type="password" />
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Sign Up'}
          </PrimaryButton>
        </form>
        <p className="microcopy">
          Already have an account? <Link to="/student/login">Login</Link>
        </p>
      </AuthCard>
    </AppShell>
  )
}

export default SignupPage
