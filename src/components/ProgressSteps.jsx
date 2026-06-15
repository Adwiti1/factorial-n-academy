function ProgressSteps({ steps, currentStep }) {
  return (
    <ol className="progress-steps" aria-label="Onboarding progress">
      {steps.map((step, index) => (
        <li
          className={index <= currentStep ? 'progress-step progress-step--active' : 'progress-step'}
          key={step}
        >
          <span>{index + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  )
}

export default ProgressSteps
