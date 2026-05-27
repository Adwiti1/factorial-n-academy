import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import AuthCard from '../components/AuthCard.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'

function WelcomePage() {
  return (
    <AppShell>
      <AuthCard className="welcome-card">
        <div className="academy-badge" aria-hidden="true">
          <span>FN</span>
        </div>
        <div className="card-heading">
          <h1>Welcome</h1>
          <p>Start your learning journey today.</p>
        </div>
        <div className="button-stack">
          <PrimaryButton to="/signup">I&apos;m New</PrimaryButton>
          <Link className="secondary-link" to="/login">
            Login
          </Link>
        </div>
      </AuthCard>
    </AppShell>
  )
}

export default WelcomePage
