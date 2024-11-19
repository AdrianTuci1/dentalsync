import React from 'react';
import { useDispatch } from 'react-redux';
import { openDrawer } from '../../shared/services/drawerSlice'; // Import the openDrawer action
import PatientTable from '../components/PatientTable';
import ActionComponent from '../components/ActionComponent';

const Patients: React.FC = () => {
  const dispatch = useDispatch();

  // Open drawer for adding a new patient
  const handleAddPatientClick = () => {
    dispatch(openDrawer({ type: 'Patient', data: { patientId: null } }));
  };

  // Open drawer for editing an existing patient
  const handlePatientClick = (patientId: string) => {
    dispatch(openDrawer({ type: 'Patient', data: { patientId } }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div
        className="padding-box"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px', width: '100%', height: 'calc(100vh - 60px)' }}
      >
        <div className="box" style={{ display: 'flex', width: '100%', height: '100%', borderRadius: '10px', flexDirection: 'column' }}>
          <ActionComponent toggleDrawer={handleAddPatientClick} /> {/* Opens with empty form */}
          <PatientTable onPatientClick={handlePatientClick} />
        </div>
      </div>
    </div>
  );
};

export default Patients;
