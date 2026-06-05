import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { getSelectedClassroomId } from '../services/selectedClassroom.js'
import { getTeacherAnalytics } from '../services/teacherAnalytics.js'

function TeacherAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
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

    async function loadAnalytics() {
      const result = await getTeacherAnalytics(classroomId)

      if (isMounted) {
        setAnalytics(result.analytics)
        setIsLoading(false)
      }
    }

    loadAnalytics()

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
            <p>Analytics</p>
            <h1>Class progress</h1>
          </div>
        </div>

        {isLoading && <p className="microcopy">Loading analytics...</p>}
        {!isLoading && analytics && (
          <>
        <section className="analytics-summary-grid">
          <article>
            <span>Students</span>
            <strong>{analytics.summary.students}</strong>
          </article>
          <article>
            <span>Completion</span>
            <strong>{analytics.summary.completionRate}%</strong>
          </article>
          <article>
            <span>Quiz Average</span>
            <strong>{analytics.summary.quizAverage}%</strong>
          </article>
        </section>

        <div className="classroom-content-grid">
          <section className="classroom-list-panel">
            <h2>Assignment grades</h2>
            {analytics.assignmentGrades.map(({ name, grade }) => (
              <article key={name}>
                <div>
                  <h3>{name}</h3>
                  <p>Class average</p>
                </div>
                <span>{grade}%</span>
              </article>
            ))}
          </section>

          <section className="classroom-list-panel">
            <h2>Quiz grades</h2>
            {analytics.quizGrades.map(({ name, grade }) => (
              <article key={name}>
                <div>
                  <h3>{name}</h3>
                  <p>Class average</p>
                </div>
                <span>{grade}%</span>
              </article>
            ))}
          </section>
        </div>

        <section className="classroom-list-panel">
          <h2>Module completion</h2>
          {analytics.moduleCompletion.map(({ module, title, completion }) => (
            <article key={module}>
              <div>
                <h3>{module}</h3>
                <p>{title}</p>
              </div>
              <span>{completion}% complete</span>
            </article>
          ))}
        </section>
          </>
        )}
      </section>
    </DashboardLayout>
  )
}

export default TeacherAnalyticsPage
