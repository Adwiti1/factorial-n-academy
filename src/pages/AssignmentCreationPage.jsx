import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { getSelectedClassroomId } from '../services/selectedClassroom.js'
import {
  createTeacherAssignment,
  getTeacherAssignments,
} from '../services/teacherAssignments.js'
import { getTeacherModules } from '../services/teacherModules.js'

const resourceTypes = ['PDF', 'Video', 'Slides', 'Code file']

function AssignmentCreationPage() {
  const [assignments, setAssignments] = useState([])
  const [modules, setModules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const classroomId = getSelectedClassroomId()
  const classNavItems = [
    ['Dashboard', '/dashboard', 'All classes'],
    ['Build', '/modules', 'Class lessons'],
    ['Assign', '/assignments', 'Class work'],
    ['Analytics', '/analytics', 'Class progress'],
  ]

  useEffect(() => {
    let isMounted = true

    async function loadAssignments() {
      const [assignmentResult, moduleResult] = await Promise.all([
        getTeacherAssignments(classroomId),
        getTeacherModules(classroomId),
      ])

      if (isMounted) {
        setAssignments(assignmentResult.assignments)
        setModules(moduleResult.modules)
        setIsLoading(false)
      }
    }

    loadAssignments()

    return () => {
      isMounted = false
    }
  }, [classroomId])

  async function handleCreateAssignment(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsCreating(true)
    const result = await createTeacherAssignment({
      classroomId,
      title: formData.get('title'),
      instructions: formData.get('instructions'),
      dueDate: formData.get('dueDate'),
      moduleTitle: formData.get('moduleTitle'),
      resources: formData.getAll('resources'),
      resourceFiles: formData.getAll('resourceFiles').filter((file) => file.size > 0),
    })

    if (result.state) {
      setAssignments(result.state.assignments)
    } else {
      setAssignments((currentAssignments) => [result.assignment, ...currentAssignments])
    }

    event.currentTarget.reset()
    setIsCreating(false)
  }

  return (
    <DashboardLayout navItems={classNavItems} showAssistant={false}>
      <section className="dashboard-content">
        <Link className="back-link" to={`/classroom/${classroomId}`}>
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
          {isLoading && <p className="microcopy">Loading assignments...</p>}
          {!isLoading && assignments.length === 0 && (
            <p className="microcopy">No assignments created yet.</p>
          )}
          {!isLoading && assignments.map((assignment) => (
            <article key={assignment.id}>
              <div>
                <h3>{assignment.title}</h3>
                <p>Due {assignment.dueDate}</p>
              </div>
              <span>{assignment.submissions} submitted</span>
              {assignment.uploadedResources?.length > 0 && (
                <small>{assignment.uploadedResources.length} resource files</small>
              )}
            </article>
          ))}
        </section>

        <section className="simple-assignment-form" aria-labelledby="new-assignment-title">
          <h2 id="new-assignment-title">Create new assignment</h2>
          <form onSubmit={handleCreateAssignment}>
            <label className="field" htmlFor="assignment-title">
              <span>Title</span>
              <input
                id="assignment-title"
                name="title"
                defaultValue="Autonomous Rescue Robot Challenge"
                required
              />
            </label>

            <label className="field" htmlFor="assignment-instructions">
              <span>Instructions</span>
              <textarea
                id="assignment-instructions"
                name="instructions"
                defaultValue="Design a robot route, explain sensor logic, and submit code notes."
                required
              />
            </label>

            <div className="assignment-form-row">
              <label className="field" htmlFor="assignment-due-date">
                <span>Due Date</span>
                <input id="assignment-due-date" name="dueDate" type="date" />
              </label>
              <label className="field" htmlFor="assignment-module">
                <span>Module</span>
                <select id="assignment-module" name="moduleTitle" defaultValue={modules[0]?.title ?? 'General'}>
                  <option>General</option>
                  {modules.map((module) => (
                    <option key={module.id}>{module.title}</option>
                  ))}
                </select>
              </label>
            </div>

            <fieldset className="resource-picker">
              <legend>Resources</legend>
              <div>
                {resourceTypes.map((type) => (
                  <label key={type}>
                    <input name="resources" type="checkbox" value={type} />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="field" htmlFor="assignment-resource-files">
              <span>Upload resource files</span>
              <input
                accept=".pdf,.png,.jpg,.jpeg,.gif,.ppt,.pptx,.key,.zip,.js,.jsx,.py,.java,.ino,.txt,.md,video/*,image/*"
                id="assignment-resource-files"
                multiple
                name="resourceFiles"
                type="file"
              />
            </label>

            <PrimaryButton type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Assignment'}
            </PrimaryButton>
          </form>
        </section>
      </section>
    </DashboardLayout>
  )
}

export default AssignmentCreationPage
