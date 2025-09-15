const RadioGroup = ({ 
  label, 
  name, 
  options, 
  value, 
  onChange, 
  required = false 
}) => {
  const radioGroupStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
    flexWrap: "wrap"
  };

  const radioOptionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#555",
    fontSize: "14px",
    fontWeight: "500"
  };

  return (
    <div>
      <label style={labelStyle}>
        {label} {required && "*"}
      </label>
      <div style={radioGroupStyle}>
        {options.map((option) => (
          <label key={option.value} style={radioOptionStyle}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;