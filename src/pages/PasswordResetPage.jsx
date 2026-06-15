import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { requestPasswordReset } from '../services/accountManagement.js'

function PasswordResetPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSubmitting(true)
    const result = await requestPasswordReset(formData.get('email'))

    setMessage(
      result.source === 'firebase'
        ? 'Password reset email sent.'
        : 'Demo mode: password reset request saved locally.',
    )
    setIsSubmitting(false)
  }

  return (
    <AppShell showBrand showLanguageBar={false}>
      <AuthCard>
        <div className="academy-badge" aria-hidden="true">
          <span>FN</span>
        </div>
        <div className="card-heading">
          <h1>Reset Password</h1>
          <p>Enter your account email.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="reset-email" label="Email" name="email" required type="email" />
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Email'}
          </PrimaryButton>
        </form>
        {message && <p className="microcopy">{message}</p>}
        <p className="microcopy">
          <Link to="/">Back to login choice</Link>
        </p>
      </AuthCard>
    </AppShell>
  )
}

export default PasswordResetPage
