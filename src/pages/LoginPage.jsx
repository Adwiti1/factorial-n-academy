import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { loginEducator } from '../services/educatorLogin.js'

function LoginPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await loginEducator({
        email: formData.get('email'),
        password: formData.get('password'),
      })

      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell showBrand showLanguageBar={false}>
      <AuthCard>
        <div className="academy-badge" aria-hidden="true">
          <span>FN</span>
        </div>
        <div className="card-heading">
          <h1>Login</h1>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="email" label="Email" name="email" required type="email" />
          <FormField id="password" label="Password" name="password" required type="password" />
          <Link className="forgot-link" to="/password-reset">
            Forgot Password?
          </Link>
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </PrimaryButton>
        </form>
        {errorMessage && <p className="microcopy">{errorMessage}</p>}
        <p className="microcopy">
          Don&apos;t have an account? <Link to="/signup">Create Account</Link>
        </p>
      </AuthCard>
    </AppShell>
  )
}

export default LoginPage
