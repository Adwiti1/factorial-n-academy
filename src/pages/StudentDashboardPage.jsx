import { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import {
  getFirebaseStudentDashboard,
  joinFirebaseClassroom,
  submitFirebaseAssignment,
} from '../services/firebaseStudentDashboard.js'

const studentNavItems = [
  ['Dashboard', '/student/dashboard', 'Your learning'],
  ['Modules', '/student/modules', 'Course lessons'],
  ['Assignments', '/student/assignments', 'Upcoming work'],
  ['Grades', '/student/grades', 'Scores and feedback'],
]

const emptyDashboard = {
  student: { displayName: 'Student' },
  classrooms: [],
  modules: [],
  assignments: [],
  submissions: [],
}

function formatDueDate(dueDate) {
  if (!dueDate) {
    return 'No due date'
  }

  if (typeof dueDate === 'string') {
    return dueDate
  }

  if (typeof dueDate.toDate === 'function') {
    return dueDate.toDate().toLocaleDateString()
  }

  return 'No due date'
}

function StudentDashboardPage({ view = 'dashboard' }) {
  const [dashboard, setDashboard] = useState(emptyDashboard)
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [actionError, setActionError] = useState('')
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      try {
        const result = await getFirebaseStudentDashboard()

        if (isMounted) {
          setDashboard(result)
        }
      } catch (error) {
        if (isMounted) {
          setPageError(error.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  async function refreshDashboard() {
    const result = await getFirebaseStudentDashboard()
    setDashboard(result)
  }

  async function handleJoinClassroom(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSaving(true)
    setActionError('')

    try {
      await joinFirebaseClassroom(formData.get('joinCode'))
      await refreshDashboard()
      setJoinModalOpen(false)
    } catch (error) {
      setActionError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAssignmentSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsSaving(true)
    setActionError('')

    try {
      await submitFirebaseAssignment({
        assignmentId: selectedAssignment.id,
        classroomId: selectedAssignment.classroomId,
        files: Array.from(formData.getAll('files')).filter((file) => file.size > 0),
        response: formData.get('response'),
      })
      await refreshDashboard()
      setSelectedAssignment(null)
    } catch (error) {
      setActionError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const assignmentById = useMemo(
    () => new Map(dashboard.assignments.map((assignment) => [assignment.id, assignment])),
    [dashboard.assignments],
  )
  const gradedSubmissions = dashboard.submissions.filter(
    (submission) => typeof submission.grade === 'number',
  )
  const gradeAverage = gradedSubmissions.length
    ? Math.round(
      gradedSubmissions.reduce((sum, submission) => sum + submission.grade, 0)
        / gradedSubmissions.length,
    )
    : null
  const totalLessons = dashboard.modules.reduce(
    (sum, module) => sum + (module.lessons?.length ?? 0),
    0,
  )

  const headings = {
    dashboard: ['Student dashboard', `Welcome back, ${dashboard.student.displayName}.`],
    modules: ['Your modules', 'Review lessons from each of your classrooms.'],
    assignments: ['Your assignments', 'Keep track of current and upcoming work.'],
    grades: ['Your grades', 'See assignment scores and teacher feedback.'],
  }

  return (
    <DashboardLayout
      navItems={studentNavItems}
      showAssistant={false}
      showHelp={false}
      workspaceLabel="Student workspace"
    >
      <section className="dashboard-content student-dashboard">
        <div className="workspace-heading">
          <div>
            <h1>{headings[view][0]}</h1>
            <p className="student-dashboard-intro">{headings[view][1]}</p>
          </div>
          {view === 'dashboard' && (
            <PrimaryButton
              className="compact-button"
              onClick={() => setJoinModalOpen(true)}
              type="button"
            >
              Join Classroom
            </PrimaryButton>
          )}
        </div>

        {isLoading && <p className="microcopy">Loading your dashboard...</p>}
        {!isLoading && pageError && <p className="microcopy">{pageError}</p>}

        {!isLoading && !pageError && view === 'dashboard' && (
          <>
            <section className="analytics-summary-grid" aria-label="Learning summary">
              <article>
                <span>Classes</span>
                <strong>{dashboard.classrooms.length}</strong>
              </article>
              <article>
                <span>Lessons available</span>
                <strong>{totalLessons}</strong>
              </article>
              <article>
                <span>Current average</span>
                <strong>{gradeAverage === null ? '--' : `${gradeAverage}%`}</strong>
              </article>
            </section>

            <section className="dashboard-section">
              <h2>Your classrooms</h2>
              <div className="classroom-grid">
                {dashboard.classrooms.length === 0 && (
                  <p className="microcopy">You have not joined a classroom yet.</p>
                )}
                {dashboard.classrooms.map((classroom) => (
                  <article className="classroom-card" key={classroom.id}>
                    <h3>{classroom.name}</h3>
                    <p>{classroom.subject}</p>
                    <dl>
                      <div>
                        <dt>Grade</dt>
                        <dd className="student-card-value">{classroom.grade ?? 'All'}</dd>
                      </div>
                      <div>
                        <dt>Progress</dt>
                        <dd>{classroom.progress ?? 0}%</dd>
                      </div>
                    </dl>
                    <span>{classroom.upcoming ?? 'No upcoming work'}</span>
                  </article>
                ))}
              </div>
            </section>

            <div className="classroom-content-grid student-dashboard-panels">
              <AssignmentList
                assignments={dashboard.assignments.slice(0, 3)}
                onSubmit={setSelectedAssignment}
                submissions={dashboard.submissions}
              />
              <GradeList
                assignmentById={assignmentById}
                submissions={gradedSubmissions.slice(0, 3)}
              />
            </div>
          </>
        )}

        {!isLoading && !pageError && view === 'modules' && (
          <section className="classroom-list-panel">
            <h2>Modules</h2>
            {dashboard.modules.length === 0 && <p className="microcopy">No modules available yet.</p>}
            {dashboard.modules.map((module) => (
              <article key={module.id}>
                <div>
                  <h3>{module.title}</h3>
                  <p>{module.lessons?.length ?? 0} lessons</p>
                </div>
                <span>Open module</span>
              </article>
            ))}
          </section>
        )}

        {!isLoading && !pageError && view === 'assignments' && (
          <AssignmentList
            assignments={dashboard.assignments}
            onSubmit={setSelectedAssignment}
            submissions={dashboard.submissions}
          />
        )}

        {!isLoading && !pageError && view === 'grades' && (
          <>
            <section className="analytics-summary-grid" aria-label="Grade summary">
              <article>
                <span>Overall average</span>
                <strong>{gradeAverage === null ? '--' : `${gradeAverage}%`}</strong>
              </article>
              <article>
                <span>Graded work</span>
                <strong>{gradedSubmissions.length}</strong>
              </article>
              <article>
                <span>Submitted work</span>
                <strong>{dashboard.submissions.length}</strong>
              </article>
            </section>
            <GradeList assignmentById={assignmentById} submissions={gradedSubmissions} />
          </>
        )}
      </section>

      {joinModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="classroom-modal" aria-labelledby="join-classroom-title" role="dialog">
            <button className="modal-close" onClick={() => setJoinModalOpen(false)} type="button">
              Close
            </button>
            <h2 id="join-classroom-title">Join Classroom</h2>
            <form className="auth-form" onSubmit={handleJoinClassroom}>
              <label className="field" htmlFor="student-join-code">
                <span>Join Code</span>
                <input
                  autoComplete="off"
                  id="student-join-code"
                  name="joinCode"
                  placeholder="ROBO8A"
                  required
                />
              </label>
              <PrimaryButton disabled={isSaving} type="submit">
                {isSaving ? 'Joining...' : 'Join Classroom'}
              </PrimaryButton>
              {actionError && <p className="microcopy">{actionError}</p>}
            </form>
          </section>
        </div>
      )}

      {selectedAssignment && (
        <div className="modal-backdrop" role="presentation">
          <section className="classroom-modal" aria-labelledby="submit-assignment-title" role="dialog">
            <button className="modal-close" onClick={() => setSelectedAssignment(null)} type="button">
              Close
            </button>
            <h2 id="submit-assignment-title">Submit Assignment</h2>
            <p className="student-modal-title">{selectedAssignment.title}</p>
            <form className="auth-form" onSubmit={handleAssignmentSubmit}>
              <label className="field" htmlFor="student-response">
                <span>Response</span>
                <textarea id="student-response" name="response" rows="5" />
              </label>
              <label className="field" htmlFor="student-files">
                <span>Files</span>
                <input id="student-files" multiple name="files" type="file" />
              </label>
              <PrimaryButton disabled={isSaving} type="submit">
                {isSaving ? 'Submitting...' : 'Submit Assignment'}
              </PrimaryButton>
              {actionError && <p className="microcopy">{actionError}</p>}
            </form>
          </section>
        </div>
      )}
    </DashboardLayout>
  )
}

function AssignmentList({ assignments, onSubmit, submissions }) {
  const submittedAssignmentIds = new Set(
    submissions.map((submission) => submission.assignmentId),
  )

  return (
    <section className="classroom-list-panel">
      <h2>Assignments</h2>
      {assignments.length === 0 && <p className="microcopy">No assignments available yet.</p>}
      {assignments.map((assignment) => (
        <article key={assignment.id}>
          <div>
            <h3>{assignment.title}</h3>
            <p>{assignment.moduleTitle ?? 'Class assignment'}</p>
          </div>
          <div className="student-assignment-action">
            <span>Due {formatDueDate(assignment.dueDate)}</span>
            {submittedAssignmentIds.has(assignment.id) ? (
              <strong>Submitted</strong>
            ) : (
              <button onClick={() => onSubmit(assignment)} type="button">
                Submit
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}

function GradeList({ assignmentById, submissions }) {
  return (
    <section className="classroom-list-panel">
      <h2>Recent grades</h2>
      {submissions.length === 0 && <p className="microcopy">No grades posted yet.</p>}
      {submissions.map((submission) => (
        <article key={submission.id}>
          <div>
            <h3>
              {assignmentById.get(submission.assignmentId)?.title ?? 'Graded assignment'}
            </h3>
            <p>{submission.feedback ?? 'No feedback added.'}</p>
          </div>
          <strong className="student-grade">{submission.grade}%</strong>
        </article>
      ))}
    </section>
  )
}

export default StudentDashboardPage
