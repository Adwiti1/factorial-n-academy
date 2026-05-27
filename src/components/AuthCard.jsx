function AuthCard({ children, className = '' }) {
  return <section className={`auth-card ${className}`}>{children}</section>
}

export default AuthCard
