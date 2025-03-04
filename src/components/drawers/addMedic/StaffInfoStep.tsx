import React from "react";
import styles from "./StaffInfoStep.module.scss"; // Import the CSS module

interface InfoTabProps {
  email: string;
  name: string;
  photo: string | File | null;
  medicProfile: {
    employmentType: string;
    specialization: string;
    phone: string;
    address: string;
  };
  onInfoChange: (field: keyof InfoTabProps, value: string | File | null) => void;
  onProfileChange: (field: keyof InfoTabProps["medicProfile"], value: string) => void;
}

const InfoTab: React.FC<InfoTabProps> = ({ email, name, photo, medicProfile, onInfoChange, onProfileChange }) => {
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onProfileChange(name as keyof InfoTabProps["medicProfile"], value);
  };

  const handleTopLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onInfoChange(name as keyof InfoTabProps, value);
  };

  const handleEmploymentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProfileChange("employmentType", e.target.value);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onInfoChange("photo", file);
  };

  return (
    <div className={styles.container}>
      {/* Name */}
      <div className={styles.inputGroup}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={handleTopLevelChange}
          className={styles.input}
        />
      </div>

      {/* Email */}
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={handleTopLevelChange}
          className={styles.input}
        />
      </div>

      {/* Employment Type */}
      <div className={styles.inputGroup}>
        <label htmlFor="employmentType">Employment Type:</label>
        <select
          id="employmentType"
          name="employmentType"
          value={medicProfile.employmentType}
          onChange={handleEmploymentTypeChange}
          className={styles.input}
        >
          <option value="">Select Employment Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
        </select>
      </div>

      {/* Specialization */}
      <div className={styles.inputGroup}>
        <label htmlFor="specialization">Specialization:</label>
        <input
          id="specialization"
          type="text"
          name="specialization"
          value={medicProfile.specialization}
          onChange={handleProfileChange}
          className={styles.input}
        />
      </div>

      {/* Phone */}
      <div className={styles.inputGroup}>
        <label htmlFor="phone">Phone:</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={medicProfile.phone}
          onChange={handleProfileChange}
          className={styles.input}
        />
      </div>

      {/* Address */}
      <div className={styles.inputGroup}>
        <label htmlFor="address">Address:</label>
        <input
          id="address"
          type="text"
          name="address"
          value={medicProfile.address}
          onChange={handleProfileChange}
          className={styles.input}
        />
      </div>

      {/* Photo Upload */}
      <div className={styles.photoUpload}>
        <label htmlFor="photo">Upload Photo:</label>
        {photo && (
          <img
            src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
            alt="Staff Photo"
            className={styles.photoPreview}
          />
        )}
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className={styles.fileInput}
        />
      </div>
    </div>
  );
};

export default InfoTab;