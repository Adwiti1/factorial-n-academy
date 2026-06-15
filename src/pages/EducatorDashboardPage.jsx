import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import { createTeacherClassroom, getTeacherClassroomState } from '../services/teacherClassrooms.js'

function EducatorDashboardPage() {
  const [state, setState] = useState({ classrooms: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadClassrooms() {
      try {
        const result = await getTeacherClassroomState()

        if (isMounted) {
          setState(result.state)
        }
      } catch (error) {
        console.warn('Classroom list could not be loaded:', error.message)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadClassrooms()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleCreateClassroom(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsCreating(true)
    setErrorMessage('')

    try {
      const result = await createTeacherClassroom({
        name: formData.get('name'),
        grade: formData.get('grade'),
        subject: formData.get('subject'),
      })

      if (result.state) {
        setState(result.state)
      } else {
        setState((currentState) => ({
          ...currentState,
          classrooms: [result.classroom, ...currentState.classrooms],
        }))
      }

      setModalOpen(false)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <DashboardLayout showAssistant={false}>
      <section className="dashboard-content">
        <div className="workspace-heading">
          <div>
            <h1>Teacher dashboard</h1>
          </div>
          <PrimaryButton className="compact-button" onClick={() => setModalOpen(true)} type="button">
            Create Classroom
          </PrimaryButton>
        </div>

        <section className="dashboard-section">
          <h2>Your classrooms</h2>
          <div className="classroom-grid">
            {isLoading && <p className="microcopy">Loading classrooms...</p>}
            {!isLoading && state.classrooms.length === 0 && (
              <p className="microcopy">No classrooms yet. Create one to get started.</p>
            )}
            {!isLoading && state.classrooms.map((classroom) => (
              <Link className="classroom-card classroom-card-link" key={classroom.id} to={`/classroom/${classroom.id}`}>
                <h3>{classroom.name}</h3>
                <p>{classroom.subject}</p>
                <dl>
                  <div>
                    <dt>Students</dt>
                    <dd>{classroom.students}</dd>
                  </div>
                  <div>
                    <dt>Progress</dt>
                    <dd>{classroom.progress}%</dd>
                  </div>
                </dl>
                <span>{classroom.upcoming}</span>
                <strong>Open class</strong>
              </Link>
            ))}
          </div>
        </section>
      </section>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="classroom-modal" aria-labelledby="modal-title" role="dialog">
            <button className="modal-close" onClick={() => setModalOpen(false)} type="button">
              Close
            </button>
            <h2 id="modal-title">Create Classroom</h2>
            <form className="auth-form" onSubmit={handleCreateClassroom}>
              <label className="field" htmlFor="classroom-name">
                <span>Classroom Name</span>
                <input id="classroom-name" name="name" required />
              </label>
              <label className="field" htmlFor="classroom-grade">
                <span>Grade Level</span>
                <select id="classroom-grade" name="grade" defaultValue="Grade 7-9">
                  <option>Grade 4-6</option>
                  <option>Grade 7-9</option>
                  <option>Grade 10-12</option>
                </select>
              </label>
              <label className="field" htmlFor="classroom-subject">
                <span>Subject</span>
                <select id="classroom-subject" name="subject" defaultValue="Robotics">
                  <option>Robotics</option>
                  <option>Coding</option>
                  <option>Computer Science</option>
                  <option>Engineering</option>
                </select>
              </label>
              <div className="generated-code">
                <span>Join Code</span>
                <strong>AUTO</strong>
                <small>Invite link is generated after creation.</small>
              </div>
              <PrimaryButton type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Classroom'}
              </PrimaryButton>
              {errorMessage && <p className="microcopy">{errorMessage}</p>}
            </form>
          </section>
        </div>
      )}
    </DashboardLayout>
  )
}

export default EducatorDashboardPage
