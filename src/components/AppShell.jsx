import { Link } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'
import LanguageBar from './LanguageBar.jsx'

function AppShell({ children, showBrand = false, showLanguageBar = true, topAction }) {
  return (
    <main className={`app-shell ${showLanguageBar ? '' : 'app-shell--designed-header-only'}`}>
      {showLanguageBar && <LanguageBar />}

      {showBrand && (
        <header className="brand-header">
          <button className="icon-button" type="button" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <BrandMark />
          <Link className="help-link" to="/" aria-label="Help">
            ?
          </Link>
        </header>
      )}

      {topAction && <div className="top-action">{topAction}</div>}
      <div className="screen-stage">{children}</div>
    </main>
  )
}

export default AppShell
