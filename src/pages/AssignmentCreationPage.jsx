import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { getTeacherState } from '../services/mockTeacher.js'

const resourceTypes = ['PDF', 'Video', 'Slides', 'Code file']

function AssignmentCreationPage() {
  const { assignments } = getTeacherState()
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
            <p>Assign</p>
            <h1>Assignments</h1>
          </div>
        </div>

        <section className="classroom-list-panel assignment-list-panel">
          <h2>Current assignments</h2>
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

        <section className="simple-assignment-form" aria-labelledby="new-assignment-title">
          <h2 id="new-assignment-title">Create new assignment</h2>
          <form>
            <label className="field" htmlFor="assignment-title">
              <span>Title</span>
              <input id="assignment-title" defaultValue="Autonomous Rescue Robot Challenge" />
            </label>

            <label className="field" htmlFor="assignment-instructions">
              <span>Instructions</span>
              <textarea
                id="assignment-instructions"
                defaultValue="Design a robot route, explain sensor logic, and submit code notes."
              />
            </label>

            <div className="assignment-form-row">
              <label className="field" htmlFor="assignment-due-date">
                <span>Due Date</span>
                <input id="assignment-due-date" type="date" />
              </label>
              <label className="field" htmlFor="assignment-module">
                <span>Module</span>
                <select id="assignment-module" defaultValue="Module 1">
                  <option>Module 1</option>
                  <option>Module 2</option>
                </select>
              </label>
            </div>

            <fieldset className="resource-picker">
              <legend>Resources</legend>
              <div>
                {resourceTypes.map((type) => (
                  <label key={type}>
                    <input type="checkbox" />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <PrimaryButton type="button">Create Assignment</PrimaryButton>
          </form>
        </section>
      </section>
    </DashboardLayout>
  )
}

export default AssignmentCreationPage
