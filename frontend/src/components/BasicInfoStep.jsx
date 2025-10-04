import InputField from "./InputField";
import Button from "./Button";

const BasicInfoStep = ({ formData, handleChange, onNext }) => {
  return (
    <>
      <InputField
        label="Full Name"
        name="fullName"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={handleChange}
        required={true}
      />

      <InputField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required={true}
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        required={true}
        minLength={6}
      />

      <InputField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required={true}
        minLength={6}
      />

      <Button type="submit" onClick={onNext}>
        Next
      </Button>
    </>
  );
};

export default BasicInfoStep;