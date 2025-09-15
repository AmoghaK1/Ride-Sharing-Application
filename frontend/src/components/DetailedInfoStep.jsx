import InputField from "./InputField";
import RadioGroup from "./RadioGroup";
import TextArea from "./TextArea";
import Button from "./Button";
import { 
  RESIDENCE_TYPES, 
  VEHICLE_OPTIONS, 
  VEHICLE_TYPES 
} from "../constants/registerConstants";

const DetailedInfoStep = ({ formData, handleChange, onBack, onSubmit }) => {
  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "15px",
    marginTop: "25px",
    borderBottom: "2px solid #007bff",
    paddingBottom: "5px"
  };

  const routeContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
    flexWrap: "wrap"
  };

  const checkboxContainerStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa"
  };

  const residenceOptions = [
    { value: RESIDENCE_TYPES.HOSTELITE, label: "Hostelite" },
    { value: RESIDENCE_TYPES.LOCALITE, label: "Localite" }
  ];

  const vehicleOptions = [
    { value: VEHICLE_OPTIONS.YES, label: "Yes" },
    { value: VEHICLE_OPTIONS.NO, label: "No" }
  ];

  const vehicleTypeOptions = [
    { value: VEHICLE_TYPES.TWO_WHEELER, label: "2 Wheeler" },
    { value: VEHICLE_TYPES.FOUR_WHEELER, label: "4 Wheeler" }
  ];

  return (
    <>
      <div>
        <h3 style={sectionTitleStyle}>Residence Type</h3>
        <RadioGroup
          name="residenceType"
          options={residenceOptions}
          value={formData.residenceType}
          onChange={handleChange}
          required={true}
        />
      </div>

      <div>
        <h3 style={sectionTitleStyle}>Vehicle Information</h3>
        <RadioGroup
          label="Do you have a vehicle for commute?"
          name="hasVehicle"
          options={vehicleOptions}
          value={formData.hasVehicle}
          onChange={handleChange}
          required={true}
        />

        {formData.hasVehicle === VEHICLE_OPTIONS.YES && (
          <RadioGroup
            label="Vehicle Type"
            name="vehicleType"
            options={vehicleTypeOptions}
            value={formData.vehicleType}
            onChange={handleChange}
            required={true}
          />
        )}
      </div>

      <div>
        <h3 style={sectionTitleStyle}>Daily Commute Route</h3>
        <div style={routeContainerStyle}>
          <div style={{ flex: "1", minWidth: "250px" }}>
            <div style={{ fontSize: "14px", fontWeight: "500", color: "#555", marginBottom: "8px" }}>
              From (Home/Hostel Address) *
            </div>
            <InputField
              name="homeAddress.societyHostelName"
              placeholder="Society/Hostel Name"
              value={formData.homeAddress.societyHostelName}
              onChange={handleChange}
              required={true}
            />
            <InputField
              name="homeAddress.street"
              placeholder="Street"
              value={formData.homeAddress.street}
              onChange={handleChange}
              required={true}
            />
            <InputField
              name="homeAddress.area"
              placeholder="Area"
              value={formData.homeAddress.area}
              onChange={handleChange}
              required={true}
            />
            <InputField
              name="homeAddress.pinCode"
              placeholder="Pin Code"
              value={formData.homeAddress.pinCode}
              onChange={handleChange}
              required={true}
              pattern="[0-9]{6}"
            />
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            fontSize: "20px", 
            fontWeight: "bold",
            color: "#007bff",
            margin: "0 10px"
          }}>
            →
          </div>
          
          <div style={{ flex: "1", minWidth: "250px" }}>
            <TextArea
              label="To (College Address)"
              value={formData.collegeAddress}
              readOnly={true}
              rows={5}
              style={{ height: "120px" }}
            />
          </div>
        </div>
      </div>

      <div style={checkboxContainerStyle}>
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          required
          style={{ marginTop: "2px" }}
        />
        <label style={{ fontSize: "14px", lineHeight: "1.5" }}>
          I agree to the{" "}
          <a href="#" style={{ color: "#007bff", textDecoration: "none" }}>
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="#" style={{ color: "#007bff", textDecoration: "none" }}>
            Privacy Policy
          </a>
          . I understand that my information will be used for ride-sharing coordination and may be shared with other users for carpooling purposes.
        </label>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <Button 
          type="button"
          onClick={onBack}
          variant="secondary"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          onClick={onSubmit}
        >
          Register
        </Button>
      </div>
    </>
  );
};

export default DetailedInfoStep;