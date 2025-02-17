import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openDrawer } from '@/components/drawerSlice';
import PatientTable from '../components/PatientTable';
import ActionComponent from '../components/ActionComponent';
import usePatients from '@/api/hooks/usePatients';


const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dispatch = useDispatch();

  // Use the custom hook to get patients data.
  const { patients, loading, error, loadMore } = usePatients(searchTerm);


  // ✅ Open drawer for adding a new patient
  const handleAddPatientClick = () => {
    dispatch(openDrawer({ type: "Patient", data: { patientId: null } }));
  };

  // ✅ Open drawer for editing a patient
  const handlePatientClick = (patientId: string) => {
    dispatch(openDrawer({ type: "Patient", data: { patientId } }));
  };

  // ✅ Handle search input change (Triggers new fetch)
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };



  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div
        className="padding-box"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0px',
          width: '100%',
          height: 'calc(100vh - 60px)',
        }}
      >
        <div
          className="box"
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            borderRadius: '10px',
            flexDirection: 'column',
          }}
        >
          {/* Action Component with Search */}
          <ActionComponent toggleDrawer={handleAddPatientClick} onSearch={handleSearch} />

          {/* Patient Table */}
          <PatientTable
            patients={patients}
            onPatientClick={handlePatientClick}
            onLoadMore={loadMore}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Patients;