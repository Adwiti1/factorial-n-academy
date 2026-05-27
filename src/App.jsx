import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import GoalSelectionPage from './pages/GoalSelectionPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import PlatformIntroPage from './pages/PlatformIntroPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import WelcomePage from './pages/WelcomePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/intro" element={<PlatformIntroPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/goals" element={<GoalSelectionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
