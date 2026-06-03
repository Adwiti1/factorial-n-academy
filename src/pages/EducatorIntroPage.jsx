import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'

function EducatorIntroPage() {
  return (
    <AppShell showBrand showLanguageBar={false}>
      <section className="teacher-onboarding-stack">
        <div className="mission-briefing">
          <div className="briefing-video briefing-placeholder" aria-hidden="true">
            <span>Platform introduction placeholder</span>
          </div>
          <div className="intro-actions">
            <Link to="/teacher-profile">Skip</Link>
            <PrimaryButton to="/teacher-profile">Continue</PrimaryButton>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

export default EducatorIntroPage
