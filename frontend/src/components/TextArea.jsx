const TextArea = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  readOnly = false,
  rows = 3,
  style = {}
}) => {
  const textareaStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
    resize: "vertical",
    backgroundColor: readOnly ? "#f8f9fa" : "white",
    cursor: readOnly ? "not-allowed" : "text",
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
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        rows={rows}
        style={textareaStyle}
        onFocus={(e) => !readOnly && (e.target.style.borderColor = "#007bff")}
        onBlur={(e) => !readOnly && (e.target.style.borderColor = "#ddd")}
      />
    </div>
  );
};

export default TextArea;