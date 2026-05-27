function SelectField({ icon, label, id, children, ...selectProps }) {
  return (
    <label className="select-field" htmlFor={id}>
      <span className="select-field__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="select-field__label">{label}</span>
      <select id={id} {...selectProps}>
        {children}
      </select>
    </label>
  )
}

export default SelectField
