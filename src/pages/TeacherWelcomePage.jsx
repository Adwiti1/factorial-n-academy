import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import AuthCard from '../components/AuthCard.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'

function TeacherWelcomePage() {
  return (
    <AppShell>
      <AuthCard className="teacher-welcome-card">
        <div className="educator-badge" aria-hidden="true">
          <span>FN</span>
        </div>
        <div className="card-heading teacher-heading">
          <h1>Welcome, Educator</h1>
          <p>Build interactive STEM classrooms with AI-powered learning.</p>
        </div>
        <div className="button-stack">
          <PrimaryButton to="/signup">Create Educator Account</PrimaryButton>
          <Link className="outline-button" to="/login">
            Login
          </Link>
        </div>
        <p className="tiny-note">For Grades 4-12 educators and learning programs</p>
      </AuthCard>
    </AppShell>
  )
}

export default TeacherWelcomePage
