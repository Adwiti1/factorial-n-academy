import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { getTeacherState } from '../services/mockTeacher.js'

const moduleCompletion = [
  ['Module 1', 'Robotics Foundations', 88],
  ['Module 2', 'Mission Map Challenge', 64],
  ['Module 3', 'Final Build Project', 42],
]

const assignmentGrades = [
  ['Rescue Robot Brief', '84%'],
  ['Loops Mini Quiz Prep', '78%'],
  ['Mission Map Plan', '91%'],
]

const quizGrades = [
  ['Robotics Safety Quiz', '86%'],
  ['Python Loops Quiz', '72%'],
  ['Sensors Checkpoint', '88%'],
]

function TeacherAnalyticsPage() {
  const { analytics, classrooms } = getTeacherState()
  const classroom = classrooms[0]
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
            <p>Analytics</p>
            <h1>Class progress</h1>
          </div>
        </div>

        <section className="analytics-summary-grid">
          <article>
            <span>Students</span>
            <strong>{classroom.students}</strong>
          </article>
          <article>
            <span>Completion</span>
            <strong>{analytics.completionRate}%</strong>
          </article>
          <article>
            <span>Quiz Average</span>
            <strong>{analytics.quizAverage}%</strong>
          </article>
        </section>

        <div className="classroom-content-grid">
          <section className="classroom-list-panel">
            <h2>Assignment grades</h2>
            {assignmentGrades.map(([name, grade]) => (
              <article key={name}>
                <div>
                  <h3>{name}</h3>
                  <p>Class average</p>
                </div>
                <span>{grade}</span>
              </article>
            ))}
          </section>

          <section className="classroom-list-panel">
            <h2>Quiz grades</h2>
            {quizGrades.map(([name, grade]) => (
              <article key={name}>
                <div>
                  <h3>{name}</h3>
                  <p>Class average</p>
                </div>
                <span>{grade}</span>
              </article>
            ))}
          </section>
        </div>

        <section className="classroom-list-panel">
          <h2>Module completion</h2>
          {moduleCompletion.map(([module, title, completion]) => (
            <article key={module}>
              <div>
                <h3>{module}</h3>
                <p>{title}</p>
              </div>
              <span>{completion}% complete</span>
            </article>
          ))}
        </section>
      </section>
    </DashboardLayout>
  )
}

export default TeacherAnalyticsPage
