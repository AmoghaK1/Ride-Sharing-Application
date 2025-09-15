const InputField = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  minLength,
  pattern,
  style = {}
}) => {
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
    ...style
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
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        pattern={pattern}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = "#007bff"}
        onBlur={(e) => e.target.style.borderColor = "#ddd"}
      />
    </div>
  );
};

export default InputField;