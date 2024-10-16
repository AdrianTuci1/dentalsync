import React from 'react';

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
    onInfoChange('employmentType', e.target.value);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onInfoChange('photo', file); // Pass the file directly through onInfoChange
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={info.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Employment Type:
          <select
            name="employmentType"
            value={info.employmentType}
            onChange={handleEmploymentTypeChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            <option value="">Select Employment Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Specialist:
          <input
            type="text"
            name="specialization"
            value={info.specialization}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={info.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={info.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={info.address}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Upload Photo:
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ width: '100%', marginTop: '0.25rem' }}
          />
        </label>
      </div>
    </div>
  );
};

export default InfoTab;
