import { Link, Navigate, useParams } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { getClassroomById, getTeacherState } from '../services/mockTeacher.js'

function ClassroomDetailPage() {
  const { classroomId } = useParams()
  const classroom = getClassroomById(classroomId)
  const { analytics, assignments, modules } = getTeacherState()

  if (!classroom) {
    return <Navigate to="/dashboard" replace />
  }

  const classNavItems = [
    ['Dashboard', '/dashboard', 'All classes'],
    ['Build', '/modules', 'Class lessons'],
    ['Assign', '/assignments', 'Class work'],
    ['Analytics', '/analytics', 'Class progress'],
  ]

  return (
    <DashboardLayout navItems={classNavItems} showAssistant={false}>
      <section className="dashboard-content">
        <Link className="back-link" to="/dashboard">
          Back to classrooms
        </Link>

        <div className="workspace-heading">
          <div>
            <p>Selected classroom</p>
            <h1>{classroom.name}</h1>
          </div>
        </div>

        <section className="classroom-detail-summary">
          <article>
            <span>Subject</span>
            <strong>{classroom.subject}</strong>
          </article>
          <article>
            <span>Students</span>
            <strong>{classroom.students}</strong>
          </article>
          <article>
            <span>Progress</span>
            <strong>{classroom.progress}%</strong>
          </article>
          <article>
            <span>Join Code</span>
            <strong>{classroom.joinCode}</strong>
          </article>
        </section>

        <div className="classroom-content-grid">
          <section className="classroom-list-panel">
            <h2>Uploaded modules</h2>
            {modules.map((module) => (
              <article key={module.id}>
                <div>
                  <h3>{module.title}</h3>
                  <p>{module.lessons.length} lessons uploaded</p>
                </div>
                <span>{module.lessons[0]?.time}</span>
              </article>
            ))}
          </section>

          <section className="classroom-list-panel">
            <h2>Assignments</h2>
            {assignments.map((assignment) => (
              <article key={assignment.id}>
                <div>
                  <h3>{assignment.title}</h3>
                  <p>Due {assignment.dueDate}</p>
                </div>
                <span>{assignment.submissions} submitted</span>
              </article>
            ))}
          </section>
        </div>

        <section className="classroom-list-panel">
          <h2>Progress</h2>
          <div className="analytics-bars">
            <span style={{ '--value': `${classroom.progress}%` }}>Class progress {classroom.progress}%</span>
            <span style={{ '--value': `${analytics.completionRate}%` }}>Completion {analytics.completionRate}%</span>
            <span style={{ '--value': `${analytics.quizAverage}%` }}>Quiz average {analytics.quizAverage}%</span>
          </div>
        </section>
      </section>
    </DashboardLayout>
  )
}

export default ClassroomDetailPage
