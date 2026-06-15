import DashboardLayout from '../components/DashboardLayout.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'

const questionTypes = ['Multiple Choice', 'True/False', 'Short Answer', 'Coding Question']

function QuizBuilderPage() {
  return (
    <DashboardLayout>
      <section className="workspace-page">
        <div className="workspace-heading">
          <div>
            <p>Quiz Builder</p>
            <h1>Create a clean classroom assessment</h1>
          </div>
          <PrimaryButton className="compact-button" type="button">
            Save Quiz
          </PrimaryButton>
        </div>

        <div className="question-type-grid">
          {questionTypes.map((type) => (
            <button key={type} type="button">
              {type}
            </button>
          ))}
        </div>

        <section className="coding-question-card">
          <div>
            <h2>Coding Question</h2>
            <p>Ask students to complete a Python loop that drives a robot forward three times.</p>
          </div>
          <pre>{`for step in range(3):\n    robot.move_forward()\n    robot.scan()`}</pre>
          <div className="code-actions">
            <button type="button">Run</button>
            <label>
              <input type="checkbox" />
              AI hint
            </label>
          </div>
        </section>
      </section>
    </DashboardLayout>
  )
}

export default QuizBuilderPage
