// SettingsPage.tsx
import React, { useState } from 'react';
import '../../styles/patientDashboard/settingsPage.scss'

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="settings-page">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => handleTabChange(0)}
        >
          Info
        </button>
        <button
          className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => handleTabChange(1)}
        >
          Files
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 0 && (
          <div className="info-tab">
            <div className="form-group">
              <label>Profile Image</label>
              <input type="file" />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" placeholder="Enter your age" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <input type="text" placeholder="Enter your gender" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" placeholder="Enter your address" />
            </div>
            <button className="save-button">Save Changes</button>
          </div>
        )}
        {activeTab === 1 && (
          <div className="files-tab">
            <div className="form-group">
              <label>Upload File</label>
              <input type="file" />
            </div>
            <ul className="files-list">
              <li>File1.pdf</li>
              <li>File2.jpg</li>
              <li>File3.docx</li>
              {/* Add more files as needed */}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
