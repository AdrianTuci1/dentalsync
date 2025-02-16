import React from "react";
import styles from "./StaffInfoStep.module.scss"; // Import the CSS module

interface InfoTabProps {
  info: {
    name: string;
    employmentType: string;
    specialization: string;
    phone: string;
    email: string;
    address: string;
    photo: string;
  };
  onInfoChange: (field: string, value: string | File | null) => void;
}

const InfoTab: React.FC<InfoTabProps> = ({ info, onInfoChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onInfoChange(name, value);
  };

  const handleEmploymentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onInfoChange("employmentType", e.target.value);
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
        <input id="name" type="text" name="name" value={info.name} onChange={handleChange} className={styles.input} />
      </div>

      {/* Employment Type */}
      <div className={styles.inputGroup}>
        <label htmlFor="employmentType">Employment Type:</label>
        <select id="employmentType" name="employmentType" value={info.employmentType} onChange={handleEmploymentTypeChange} className={styles.input}>
          <option value="">Select Employment Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
        </select>
      </div>

      {/* Specialization */}
      <div className={styles.inputGroup}>
        <label htmlFor="specialization">Specialization:</label>
        <input id="specialization" type="text" name="specialization" value={info.specialization} onChange={handleChange} className={styles.input} />
      </div>

      {/* Phone */}
      <div className={styles.inputGroup}>
        <label htmlFor="phone">Phone:</label>
        <input id="phone" type="tel" name="phone" value={info.phone} onChange={handleChange} className={styles.input} />
      </div>

      {/* Email */}
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" name="email" value={info.email} onChange={handleChange} className={styles.input} />
      </div>

      {/* Address */}
      <div className={styles.inputGroup}>
        <label htmlFor="address">Address:</label>
        <input id="address" type="text" name="address" value={info.address} onChange={handleChange} className={styles.input} />
      </div>

      {/* Photo Upload */}
      <div className={styles.photoUpload}>
        <label htmlFor="photo">Upload Photo:</label>
        {info.photo && (
          <img src={typeof info.photo === "string" ? info.photo : URL.createObjectURL(info.photo)} alt="Staff Photo" className={styles.photoPreview} />
        )}
        <input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className={styles.fileInput} />
      </div>
    </div>
  );
};

export default InfoTab;