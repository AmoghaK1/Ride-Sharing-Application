import { useRegisterForm } from "../hooks/useRegisterForm";
import BasicInfoStep from "../components/BasicInfoStep";
import DetailedInfoStep from "../components/DetailedInfoStep";
import { FORM_PAGES } from "../constants/registerConstants";

function Register() {
  const {
    currentPage,
    formData,
    handleChange,
    handleNextPage,
    handlePreviousPage,
    handleSubmit
  } = useRegisterForm();

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    paddingTop: "40px"
  };

  const formStyle = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px"
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
    fontSize: "28px",
    fontWeight: "600"
  };

  return (
    <div style={containerStyle}>
      <form 
        onSubmit={currentPage === FORM_PAGES.BASIC_INFO ? handleNextPage : handleSubmit} 
        style={formStyle}
      >
        <h2 style={titleStyle}>
          {currentPage === FORM_PAGES.BASIC_INFO ? "Create Account - Step 1" : "Create Account - Step 2"}
        </h2>
        
        {currentPage === FORM_PAGES.BASIC_INFO && (
          <BasicInfoStep 
            formData={formData}
            handleChange={handleChange}
            onNext={handleNextPage}
          />
        )}

        {currentPage === FORM_PAGES.DETAILED_INFO && (
          <DetailedInfoStep 
            formData={formData}
            handleChange={handleChange}
            onBack={handlePreviousPage}
            onSubmit={handleSubmit}
          />
        )}

        <p style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#666",
          fontSize: "14px"
        }}>
          Already have an account? 
          <a href="#" style={{
            color: "#007bff",
            textDecoration: "none",
            fontWeight: "500",
            marginLeft: "5px"
          }}>
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;