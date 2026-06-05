import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { getSelectedClassroomId } from '../services/selectedClassroom.js'
import { getTeacherModules } from '../services/teacherModules.js'

function ModuleBuilderPage() {
  const [modules, setModules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const classroomId = getSelectedClassroomId()
  const classNavItems = [
    ['Dashboard', '/dashboard', 'All classes'],
    ['Build', '/modules', 'Class lessons'],
    ['Assign', '/assignments', 'Class work'],
    ['Analytics', '/analytics', 'Class progress'],
  ]

  useEffect(() => {
    let isMounted = true

    async function loadModules() {
      const result = await getTeacherModules(classroomId)

      if (isMounted) {
        setModules(result.modules)
        setIsLoading(false)
      }
    }

    loadModules()

    return () => {
      isMounted = false
    }
  }, [classroomId])

  return (
    <DashboardLayout navItems={classNavItems} showAssistant={false}>
      <section className="dashboard-content">
        <Link className="back-link" to={`/classroom/${classroomId}`}>
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
          {isLoading && <p className="microcopy">Loading modules...</p>}
          {!isLoading && modules.length === 0 && (
            <p className="microcopy">No modules saved yet.</p>
          )}
          {!isLoading && modules.map((module) => (
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
