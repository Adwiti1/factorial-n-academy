import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import ProgressSteps from '../components/ProgressSteps.jsx'

const slides = [
  {
    title: 'Create your classroom',
    text: 'Create classrooms and invite students using secure join codes.',
    visual: ['Class name', 'Join code', 'Roster'],
  },
  {
    title: 'Build and assign',
    text: 'Build STEM learning journeys with projects, quizzes, and robotics challenges.',
    visual: ['Module', 'Assignment', 'Quiz'],
  },
  {
    title: 'Track progress',
    text: 'See engagement, quiz performance, and AI recommendations in one place.',
    visual: ['Progress', 'Signals', 'AI help'],
  },
]

const trainingSteps = [
  ['1', 'Create a classroom', 'Add a class and get a join code.'],
  ['2', 'Build lessons', 'Add the first lesson or activity.'],
  ['3', 'Post an assignment', 'Create something for students to submit.'],
]

function TeacherTutorialPage() {
  const [slideIndex, setSlideIndex] = useState(0)
  const slide = slides[slideIndex]

  return (
    <AppShell showBrand showLanguageBar={false}>
      <section className="teacher-onboarding-stack">
        <ProgressSteps currentStep={3} steps={['Briefing', 'Profile', 'Experience', 'Training']} />
        <section className="tutorial-card" aria-labelledby="tutorial-title">
          <div className="tutorial-visual" aria-hidden="true">
            {slide.visual.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
          <div className="page-heading centered-heading">
            <h1 id="tutorial-title">{slide.title}</h1>
            <p>{slide.text}</p>
          </div>
          <div className="tutorial-dots" aria-label="Tutorial slides">
            {slides.map((item, index) => (
              <button
                aria-label={item.title}
                className={index === slideIndex ? 'tutorial-dot tutorial-dot--active' : 'tutorial-dot'}
                key={item.title}
                onClick={() => setSlideIndex(index)}
                type="button"
              />
            ))}
          </div>
          <section className="quick-start-panel training-steps-panel" aria-labelledby="training-steps-title">
            <div>
              <p>Start here</p>
              <h2 id="training-steps-title">Start with these steps</h2>
            </div>
            <div className="quick-start-grid">
              {trainingSteps.map(([number, title, detail]) => (
                <article key={title}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </article>
              ))}
            </div>
          </section>
          <div className="tutorial-actions">
            <Link to="/dashboard">Skip Tutorial</Link>
            {slideIndex < slides.length - 1 ? (
              <PrimaryButton onClick={() => setSlideIndex((next) => next + 1)} type="button">
                Continue
              </PrimaryButton>
            ) : (
              <PrimaryButton to="/dashboard">Enter Dashboard</PrimaryButton>
            )}
          </div>
        </section>
      </section>
    </AppShell>
  )
}

export default TeacherTutorialPage
