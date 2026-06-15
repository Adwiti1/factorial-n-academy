import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import {
  changeAccountEmail,
  changeAccountPassword,
  requestEmailVerification,
} from '../services/accountManagement.js'

function AccountSettingsPage() {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleEmailSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSubmitting(true)
    const result = await changeAccountEmail(formData.get('email'))
    setMessage(result.source === 'firebase' ? 'Email updated.' : 'Demo mode: email update saved locally.')
    setIsSubmitting(false)
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSubmitting(true)
    const result = await changeAccountPassword(formData.get('password'))
    setMessage(result.source === 'firebase' ? 'Password updated.' : 'Demo mode: password update saved locally.')
    setIsSubmitting(false)
  }

  async function handleVerificationClick() {
    setIsSubmitting(true)
    const result = await requestEmailVerification()
    setMessage(
      result.source === 'firebase'
        ? 'Verification email sent.'
        : 'Demo mode: verification request saved locally.',
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
          <h1>Account</h1>
          <p>Manage email, password, and verification.</p>
        </div>

        <form className="auth-form" onSubmit={handleEmailSubmit}>
          <FormField id="account-email" label="New Email" name="email" required type="email" />
          <PrimaryButton type="submit" disabled={isSubmitting}>
            Update Email
          </PrimaryButton>
        </form>

        <form className="auth-form" onSubmit={handlePasswordSubmit}>
          <FormField
            id="account-password"
            label="New Password"
            minLength="6"
            name="password"
            required
            type="password"
          />
          <PrimaryButton type="submit" disabled={isSubmitting}>
            Update Password
          </PrimaryButton>
        </form>

        <PrimaryButton onClick={handleVerificationClick} type="button" disabled={isSubmitting}>
          Send Verification Email
        </PrimaryButton>

        {message && <p className="microcopy">{message}</p>}
        <p className="microcopy">
          <Link to="/">Back to login choice</Link>
        </p>
      </AuthCard>
    </AppShell>
  )
}

export default AccountSettingsPage
