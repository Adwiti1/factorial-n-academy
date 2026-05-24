import { Link } from 'react-router-dom'

function PrimaryButton({ children, className = '', to, ...buttonProps }) {
  if (to) {
    return (
      <Link className={`primary-button ${className}`} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button className={`primary-button ${className}`} {...buttonProps}>
      {children}
    </button>
  )
}

export default PrimaryButton
