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
    marginBottom: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "clamp(14px, 3.5vw, 16px)",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
    ...style
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#374151",
    fontSize: "clamp(14px, 3.5vw, 16px)",
    fontWeight: "500"
  };

  return (
    <div>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
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
        onFocus={(e) => {
          e.target.style.borderColor = "#3b82f6";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d1d5db";
        }}
      />
    </div>
  );
};

export default InputField;