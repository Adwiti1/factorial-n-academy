import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AssignmentCreationPage from './pages/AssignmentCreationPage.jsx'
import ClassroomDetailPage from './pages/ClassroomDetailPage.jsx'
import EducatorDashboardPage from './pages/EducatorDashboardPage.jsx'
import EducatorIntroPage from './pages/EducatorIntroPage.jsx'
import EducatorSignupPage from './pages/EducatorSignupPage.jsx'
import GoalSelectionPage from './pages/GoalSelectionPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ModuleBuilderPage from './pages/ModuleBuilderPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import PlatformIntroPage from './pages/PlatformIntroPage.jsx'
import QuizBuilderPage from './pages/QuizBuilderPage.jsx'
import RoleSelectionPage from './pages/RoleSelectionPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import StudentLoginPage from './pages/StudentLoginPage.jsx'
import TeacherAnalyticsPage from './pages/TeacherAnalyticsPage.jsx'
import TeacherExperiencePage from './pages/TeacherExperiencePage.jsx'
import TeacherProfilePage from './pages/TeacherProfilePage.jsx'
import TeacherTutorialPage from './pages/TeacherTutorialPage.jsx'
import TeacherWelcomePage from './pages/TeacherWelcomePage.jsx'
import WelcomePage from './pages/WelcomePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/teacher" element={<TeacherWelcomePage />} />
        <Route path="/signup" element={<EducatorSignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/intro" element={<EducatorIntroPage />} />
        <Route path="/teacher-profile" element={<TeacherProfilePage />} />
        <Route path="/teacher-experience" element={<TeacherExperiencePage />} />
        <Route path="/teacher-tutorial" element={<TeacherTutorialPage />} />
        <Route path="/dashboard" element={<EducatorDashboardPage />} />
        <Route path="/classroom/:classroomId" element={<ClassroomDetailPage />} />
        <Route path="/modules" element={<ModuleBuilderPage />} />
        <Route path="/assignments" element={<AssignmentCreationPage />} />
        <Route path="/quizzes" element={<QuizBuilderPage />} />
        <Route path="/analytics" element={<TeacherAnalyticsPage />} />
        <Route path="/student" element={<WelcomePage />} />
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/student/signup" element={<SignupPage />} />
        <Route path="/student/intro" element={<PlatformIntroPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/goals" element={<GoalSelectionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
