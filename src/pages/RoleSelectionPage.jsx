import AppShell from '../components/AppShell.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'

function RoleSelectionPage() {
  return (
    <AppShell>
      <section className="role-select-card" aria-labelledby="role-title">
        <div className="academy-badge role-main-logo" aria-hidden="true">
          <span>FN</span>
        </div>
        <div className="card-heading teacher-heading">
          <h1 id="role-title">Choose your login</h1>
          <p>Select the experience you want to use.</p>
        </div>

        <div className="role-option-grid">
          <PrimaryButton to="/student">Student Login</PrimaryButton>
          <PrimaryButton to="/teacher">Teacher Login</PrimaryButton>
        </div>
      </section>
    </AppShell>
  )
}

export default RoleSelectionPage
