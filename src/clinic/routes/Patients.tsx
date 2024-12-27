import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openDrawer } from '../../shared/services/drawerSlice';
import { fetchPatients } from '../../shared/services/patientUserSlice';
import PatientTable from '../components/PatientTable';
import ActionComponent from '../components/ActionComponent';
import { AppDispatch } from '../../shared/services/store';


const Patients: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [patients, setPatients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(); // Search input
    const [offset, setOffset] = useState<number>(0); // Offset for pagination
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    // Fetch patients from API
    const fetchPatientsList = async (reset = false) => {
      try {
        const response: any = await dispatch(
          fetchPatients({ name: searchTerm, offset: reset ? 0 : offset })
        ).unwrap();
  
        const newPatients = response.data || [];
        setPatients((prev) => (reset ? newPatients : [...prev, ...newPatients])); // Reset or append
        setOffset(reset ? response.offset : offset + 20); // Update offset
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Fetch initial patients on mount
    useEffect(() => {
      fetchPatientsList(true);
    }, []);
  
    // Open drawer for adding a new patient
    const handleAddPatientClick = () => {
      dispatch(openDrawer({ type: 'Patient', data: { patientId: null } }));
    };
  
    // Open drawer for editing a patient
    const handlePatientClick = (patientId: string) => {
      dispatch(openDrawer({ type: 'Patient', data: { patientId } }));
    };
  
    // Handle search input change
    const handleSearch = (value: string) => {
      setSearchTerm(value);
      fetchPatientsList(true); // Reset the patient list with the new search term
    };
  
    // Handle "Load More"
    const handleLoadMore = () => {
      fetchPatientsList();
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
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Patients;