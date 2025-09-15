import { useState } from "react";
import { 
  VALIDATION_MESSAGES, 
  DEFAULT_VALUES, 
  FORM_PAGES 
} from "../constants/registerConstants";

export const useRegisterForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateDetailedInfo()) {
      console.log("Registration Data:", formData);
      alert(`Registration successful for ${formData.fullName}!`);
    }
  };

  return {
    currentPage,
    formData,
    handleChange,
    handleNextPage,
    handlePreviousPage,
    handleSubmit
  };
};