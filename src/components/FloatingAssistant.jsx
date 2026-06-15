import { useState } from 'react'

const prompts = [
  'Generate a beginner robotics quiz',
  'Explain recursion simply',
  'Create a Grade 7 project',
  'Summarize struggling students',
]

function FloatingAssistant() {
  const [open, setOpen] = useState(false)

  return (
    <aside className={open ? 'ai-assistant ai-assistant--open' : 'ai-assistant'}>
      {open && (
        <div className="ai-assistant__panel">
          <h2>AI Teacher Assistant</h2>
          <p>Ask for lesson ideas, quiz drafts, rubrics, or student support summaries.</p>
          <div className="assistant-prompts">
            {prompts.map((prompt) => (
              <button key={prompt} type="button">
                {prompt}
              </button>
            ))}
          </div>
          <label htmlFor="assistant-message">
            Message
            <textarea id="assistant-message" placeholder="Ask for classroom support..." />
          </label>
        </div>
      )}
      <button className="ai-assistant__toggle" onClick={() => setOpen((next) => !next)} type="button">
        AI
      </button>
    </aside>
  )
}

export default FloatingAssistant
