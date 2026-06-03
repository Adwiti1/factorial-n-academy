import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { getTeacherState } from '../services/mockTeacher.js'

function ModuleBuilderPage() {
  const { modules } = getTeacherState()
  const classNavItems = [
    ['Dashboard', '/dashboard', 'All classes'],
    ['Build', '/modules', 'Class lessons'],
    ['Assign', '/assignments', 'Class work'],
    ['Analytics', '/analytics', 'Class progress'],
  ]

  return (
    <DashboardLayout navItems={classNavItems} showAssistant={false}>
      <section className="dashboard-content">
        <Link className="back-link" to="/classroom/robotics-8a">
          Back to classroom
        </Link>

        <div className="workspace-heading">
          <div>
            <p>Build</p>
            <h1>Build lessons</h1>
          </div>
        </div>

        <section className="classroom-list-panel previous-modules-panel">
          <h2>Previous modules</h2>
          {modules.map((module) => (
            <Link className="module-edit-link" key={module.id} to={`/modules/${module.id}`}>
              <div>
                <h3>{module.title}</h3>
                <p>{module.lessons.length} lessons uploaded</p>
              </div>
              <span>
                {module.lessons[0]?.time} · Edit
              </span>
            </Link>
          ))}
        </section>

        <section className="build-new-lesson-panel">
          <div>
            <h2>Build a new lesson</h2>
            <p>Add a title, resources, quiz, or coding task for this class.</p>
          </div>
          <PrimaryButton className="compact-button" type="button">
            Build a New Lesson
          </PrimaryButton>
        </section>

      </section>
    </DashboardLayout>
  )
}

export default ModuleBuilderPage
