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
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search input
  const [offset, setOffset] = useState<number>(0); // Offset for pagination
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch patients from API
  const fetchPatientsList = async (name: string, reset = false) => {
    try {
      setIsLoading(true);
      const response: any = await dispatch(
        fetchPatients({ name, offset: reset ? 0 : offset })
      ).unwrap();

      const newPatients = response.data || [];
      setPatients((prev) => (reset ? newPatients : [...prev, ...newPatients])); // Reset or append
      setOffset(reset ? 20 : offset + 20); // Reset offset or increment by 20
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when searchTerm changes
  useEffect(() => {
    fetchPatientsList(searchTerm, true); // Reset list whenever searchTerm changes
  }, [searchTerm]);

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
    setSearchTerm(value); // Update searchTerm, triggering the effect
  };

  // Handle "Load More"
  const handleLoadMore = () => {
    fetchPatientsList(searchTerm); // Pass the current search term
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