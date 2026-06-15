import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'
import FloatingAssistant from './FloatingAssistant.jsx'

const defaultNavItems = [
  ['Dashboard', '/dashboard', 'Your classes'],
]

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Francais' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'zh-mandarin', label: 'Mandarin' },
  { code: 'es', label: 'Spanish' },
]

function DashboardLayout({
  children,
  navItems = defaultNavItems,
  showAssistant = true,
  showHelp = true,
  workspaceLabel = 'Teacher workspace',
}) {
  const [language, setLanguage] = useState(
    () => window.localStorage.getItem('factorial-n-academy:language') || 'en',
  )

  function handleLanguageChange(event) {
    setLanguage(event.target.value)
    window.localStorage.setItem('factorial-n-academy:language', event.target.value)
  }

  return (
    <main className="dashboard-shell">
      <aside className="teacher-sidebar" aria-label={workspaceLabel}>
        <nav>
          {navItems.map(([label, href, hint]) => (
            <NavLink className="sidebar-link" key={label} to={href}>
              <span>{label.slice(0, 1)}</span>
              <strong>{label}</strong>
              <small>{hint}</small>
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="teacher-workspace">
        <header className="teacher-topbar">
          <BrandMark />
          <label className="dashboard-language" htmlFor="dashboard-language">
            <span>Language</span>
            <select id="dashboard-language" value={language} onChange={handleLanguageChange}>
              {languages.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </header>
        {children}
      </section>
      {showHelp && (
        <div className="dashboard-help-button" aria-label="Help">
          ?
        </div>
      )}
      {showAssistant && <FloatingAssistant />}
    </main>
  )
}

export default DashboardLayout
