const Button = ({ 
  children, 
  type = "button", 
  onClick, 
  variant = "primary", 
  style = {} 
}) => {
  const baseStyle = {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "10px"
  };

  const primaryStyle = {
    backgroundColor: "#007bff",
    color: "white"
  };

  const secondaryStyle = {
    backgroundColor: "#6c757d",
    color: "white"
  };

  const buttonStyle = {
    ...baseStyle,
    ...(variant === "primary" ? primaryStyle : secondaryStyle),
    ...style
  };

  const handleMouseOver = (e) => {
    if (variant === "primary") {
      e.target.style.backgroundColor = "#0056b3";
    } else {
      e.target.style.backgroundColor = "#5a6268";
    }
  };

  const handleMouseOut = (e) => {
    if (variant === "primary") {
      e.target.style.backgroundColor = "#007bff";
    } else {
      e.target.style.backgroundColor = "#6c757d";
    }
  };

  return (
    <button 
      type={type}
      onClick={onClick}
      style={buttonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
    </button>
  );
};

export default Button;