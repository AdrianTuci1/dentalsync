import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { Appointment } from '../../types/appointmentEvent';

import DeleteIcon from '@mui/icons-material/Delete';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import TreatmentPlan from './checkupSteps/TreatmentPlan';

// Define menu items (you can add icons later in place of the blank squares)
const menuItems = [
  { label: 'Basic Info', id: 'basic-info' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'Note', id: 'note' },
  { label: 'Medical Record', id: 'medical-record' },
  { label: 'Document', id: 'document' },
  { label: 'Billing', id: 'billing' },
];

interface ReservationDetailProps {
  onClose: () => void;
  patientData: Appointment;
}

const ReservationDetail: React.FC<ReservationDetailProps> = ({ onClose, patientData }) => {
  const [selectedMenu, setSelectedMenu] = useState('basic-info');

  const handleMenuClick = (menuId: string) => {
    setSelectedMenu(menuId);
  };

  // Render the content based on the selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'basic-info':
        return <div>Basic Info Content</div>;
      case 'timeline':
        return <div>Timeline Content</div>;
      case 'note':
        return <div>Note Content</div>;
      case 'medical-record':
        return <TreatmentPlan />;
      case 'document':
        return <div>Document Content</div>;
      case 'billing':
        return <div>Billing Content</div>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header */}
      <div
        className="drawer-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}
      >
        <h2 style={{ margin: 0 }}>Reservation ID: #{patientData.id}</h2>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      {/* Patient Info */}
      <div className="patient-info" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#ccc',
            marginRight: '15px',
          }}
        ></div>
        <div>
          <h3>{patientData.patientName}</h3>
          <p>{patientData.phone} • {patientData.email}</p>
        </div>
        <div style={{ display: 'flex', marginLeft: 'auto' }}>
          <Button variant="outlined" style={{ marginRight: '10px', fontSize:'12px' }}><TaskAltIcon /> Arrived</Button>
          <Button variant="outlined" color="error"><DeleteIcon/></Button>
        </div>
      </div>

      {/* Menu */}
      <div className="menu" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: selectedMenu === item.id ? '#e0e0e0' : 'transparent',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ccc',
                marginRight: '10px',
              }}
            ></div>
            {selectedMenu === item.id && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="menu-content">
        {renderContent()}
      </div>
    </>
  );
};

export default ReservationDetail;
