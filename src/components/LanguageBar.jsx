import { useState } from 'react'
import logo from '../assets/factorial-n-academy-logo.png'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Francais' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'zh-mandarin', label: 'Mandarin' },
  { code: 'zh-cantonese', label: 'Cantonese' },
  { code: 'es', label: 'Spanish' },
  { code: 'ar', label: 'Arabic' },
  { code: 'tl', label: 'Tagalog' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ur', label: 'Urdu' },
]

function LanguageBar() {
  const [language, setLanguage] = useState(
    () => window.localStorage.getItem('factorial-n-academy:language') || 'en',
  )

  function handleChange(event) {
    setLanguage(event.target.value)
    window.localStorage.setItem('factorial-n-academy:language', event.target.value)
  }

  return (
    <div className="language-bar">
      <img
        className="language-bar__brand"
        src={logo}
        alt="Factorial N Academy"
        width="336"
        height="67"
      />
      <select id="language" value={language} onChange={handleChange} aria-label="Language">
        {languages.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageBar
