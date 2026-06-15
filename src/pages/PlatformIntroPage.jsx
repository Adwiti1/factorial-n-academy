import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'

function PlatformIntroPage() {
  return (
    <AppShell showBrand showLanguageBar={false}>
      <section className="intro-panel" aria-labelledby="intro-title">
        <h1 id="intro-title">platform introduction</h1>
      </section>
      <div className="intro-actions">
        <Link to="/onboarding">skip</Link>
        <PrimaryButton to="/onboarding">Continue</PrimaryButton>
      </div>
    </AppShell>
  )
}

export default PlatformIntroPage
