import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInfoStep from "../components/BasicInfoStep";
import DetailedInfoStep from "../components/DetailedInfoStep";
import { 
  VALIDATION_MESSAGES, 
  DEFAULT_VALUES, 
  FORM_PAGES 
} from "../constants/registerConstants";
import { fetchWithFallback } from "../constants/api";

function Register() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(FORM_PAGES.BASIC_INFO);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    residenceType: "",
    hasVehicle: "",
    vehicleType: "",
    homeAddress: {
      societyHostelName: "",
      street: "",
      area: "",
      pinCode: ""
    },
    collegeAddress: DEFAULT_VALUES.COLLEGE_ADDRESS,
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('homeAddress.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        homeAddress: {
          ...prev.homeAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateBasicInfo = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      alert(VALIDATION_MESSAGES.REQUIRED_FIELDS);
      return false;
    }
    
    // Validate full name length
    if (formData.fullName.trim().length < 2) {
      alert(VALIDATION_MESSAGES.FULL_NAME_TOO_SHORT);
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert(VALIDATION_MESSAGES.INVALID_EMAIL);
      return false;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      alert(VALIDATION_MESSAGES.PASSWORD_TOO_SHORT);
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert(VALIDATION_MESSAGES.PASSWORD_MISMATCH);
      return false;
    }
    
    return true;
  };

  const validateDetailedInfo = () => {
    if (!formData.residenceType || !formData.hasVehicle) {
      alert(VALIDATION_MESSAGES.REQUIRED_FIELDS);
      return false;
    }
    
    if (formData.hasVehicle === "yes" && !formData.vehicleType) {
      alert(VALIDATION_MESSAGES.VEHICLE_TYPE_REQUIRED);
      return false;
    }
    
    if (!formData.homeAddress.societyHostelName || !formData.homeAddress.street || 
        !formData.homeAddress.area || !formData.homeAddress.pinCode) {
      alert(VALIDATION_MESSAGES.ADDRESS_INCOMPLETE);
      return false;
    }
    
    if (!formData.agreeToTerms) {
      alert(VALIDATION_MESSAGES.TERMS_REQUIRED);
      return false;
    }
    
    return true;
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    if (validateBasicInfo()) {
      setCurrentPage(FORM_PAGES.DETAILED_INFO);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(FORM_PAGES.BASIC_INFO);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateDetailedInfo()) {
      try {
        // Prepare data for API
        const registrationData = {
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          residence_type: formData.residenceType,
          has_vehicle: formData.hasVehicle,
          vehicle_type: formData.vehicleType || null,  // Send null instead of empty string
          home_address: {
            society_hostel_name: formData.homeAddress.societyHostelName,
            street: formData.homeAddress.street,
            area: formData.homeAddress.area,
            pin_code: formData.homeAddress.pinCode
          },
          college_address: formData.collegeAddress,
          agree_to_terms: formData.agreeToTerms
        };

        const response = await fetchWithFallback('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData)
        });

        if (response.ok) {
          const result = await response.json();
          alert(`Registration successful! Welcome ${formData.fullName}!`);
          // Redirect to login page using React Router
          navigate('/login');
        } else {
          const errorData = await response.json();
          
          // Handle validation errors from backend
          if (Array.isArray(errorData.detail)) {
            const errorMessages = errorData.detail.map(err => 
              `${err.field}: ${err.message}`
            ).join('\n');
            alert(`Registration failed:\n${errorMessages}`);
          } else {
            alert(`Registration failed: ${errorData.detail}`);
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      }
    }
  };

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
          <button 
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: "500",
              marginLeft: "5px"
            }}
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;