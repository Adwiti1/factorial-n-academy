import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { loginStudent } from '../services/studentAuth.js'

function StudentLoginPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSubmitting(true)
    await loginStudent({
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
          <h1>Student Login</h1>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="student-email" label="Email" name="email" required type="email" />
          <FormField id="student-password" label="Password" name="password" required type="password" />
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </PrimaryButton>
        </form>
        <p className="microcopy">
          Don&apos;t have an account? <Link to="/student/signup">Create Account</Link>
        </p>
      </AuthCard>
    </AppShell>
  )
}

export default StudentLoginPage
