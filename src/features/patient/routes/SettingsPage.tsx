import React, { useState } from "react";
import styles from "../styles/pages/patientSettings.module.scss";

const PatientSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    mentions: "",
    preferredDoctor: "",
    preferredDays: [] as string[],
    preferredHours: [] as string[],
    notifications: { email: true, sms: false },
    password: "",
    newPassword: "",
    confirmPassword: "",
    isChangingPassword: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({
    personalInfo: true,
    appointmentPreferences: false,
    notifications: false,
    security: false,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`Saved: ${name} = ${value}`);
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, [e.target.name]: selectedValues }));
    console.log(`Saved: ${e.target.name} = ${selectedValues}`);
  };

  // Handle checkbox toggles
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [name]: checked },
    }));
    console.log(`Saved: notifications.${name} = ${checked}`);
  };

  // Toggle sections
  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className={styles.outlineContainer}>
    <div className={styles.settingsContainer}>
      {/* Personal Information */}
      <div className={styles.window}>
        <div className={styles.windowHeader} onClick={() => toggleSection("personalInfo")}>
          <h3>Personal Information</h3>
        </div>
        {sectionsOpen.personalInfo && (
          <div className={styles.windowContent}>
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required />

            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="johndoe@example.com" required />

            <label>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" />

            <div className={styles.inlineFields}>
              <div>
                <label>Birth Date</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
              </div>
              <div>
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Preferences */}
      <div className={styles.window}>
        <div className={styles.windowHeader} onClick={() => toggleSection("appointmentPreferences")}>
          <h3>Appointment Preferences</h3>
        </div>
        {sectionsOpen.appointmentPreferences && (
          <div className={styles.windowContent}>
            <label>Preferred Doctor</label>
            <input type="text" name="preferredDoctor" value={formData.preferredDoctor} onChange={handleChange} placeholder="Dr. Smith" />

            <label>Preferred Days</label>
            <select multiple name="preferredDays" value={formData.preferredDays} onChange={handleMultiSelectChange}>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>

            <label>Preferred Hours</label>
            <select multiple name="preferredHours" value={formData.preferredHours} onChange={handleMultiSelectChange}>
              <option value="Morning">Morning (8:00 AM - 12:00 PM)</option>
              <option value="Afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
              <option value="Evening">Evening (4:00 PM - 8:00 PM)</option>
            </select>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className={styles.window}>
        <div className={styles.windowHeader} onClick={() => toggleSection("notifications")}>
          <h3>Notifications</h3>
        </div>
        {sectionsOpen.notifications && (
          <div className={styles.windowContent}>
            <label>
              <input type="checkbox" name="email" checked={formData.notifications.email} onChange={handleCheckboxChange} />
              Receive Email Notifications
            </label>
            <label>
              <input type="checkbox" name="sms" checked={formData.notifications.sms} onChange={handleCheckboxChange} />
              Receive SMS Notifications
            </label>
          </div>
        )}
      </div>

      {/* Security */}
      <div className={styles.window}>
        <div className={styles.windowHeader} onClick={() => toggleSection("security")}>
          <h3>Security</h3>
        </div>
        {sectionsOpen.security && (
          <div className={styles.windowContent}>
            <button className={styles.deleteButton} onClick={() => setShowDeleteModal(true)}>Delete Account</button>
          </div>
        )}
      </div>

      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Are you sure you want to delete your account?</h3>
            <p>This action is permanent and cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className={styles.confirmDeleteButton}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default PatientSettings;