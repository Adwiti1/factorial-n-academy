function FormField({ label, id, ...inputProps }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...inputProps} />
    </label>
  )
}

export default FormField
