import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '@/components/drawerSlice';
import { fetchPatients, selectPatientError, selectPatientLoading, selectPatientOffset, selectPatients } from '@/api/patientUserSlice';
import PatientTable from '../components/PatientTable';
import ActionComponent from '../components/ActionComponent';
import { AppDispatch } from '@/shared/services/store';
import { getSubdomain } from '@/shared/utils/getSubdomains';


const Patients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Redux State
  const patientsRedux = useSelector(selectPatients); // Table Data from Redux
  const isLoading = useSelector(selectPatientLoading);
  const error = useSelector(selectPatientError);
  const offset = useSelector(selectPatientOffset);

  // ✅ Local State for UI sync
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search input
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Prevent multiple calls

  const token = useSelector((state: any) => state.auth.subaccountToken);
  const clinicDb = `${getSubdomain()}_db`;

  // ✅ Sync Redux state to local state
  useEffect(() => {
    setPatients(patientsRedux?.patients?.data || []);
  }, [patientsRedux]);

  // ✅ Fetch patients on mount and search change
  useEffect(() => {
    if (token && clinicDb && isFirstLoad) {
      dispatch(fetchPatients({ name: searchTerm, offset: 0, token, clinicDb }) as any)
        .unwrap()
        .then((data: any) => {
          setPatients(data.patients?.data || []); // ✅ Update local state
        })
        .catch((error: any) => console.error("❌ Initial fetch failed:", error));

      setIsFirstLoad(false);
    }
  }, [token, clinicDb, isFirstLoad]);

  useEffect(() => {
    if (!isFirstLoad) {
      console.log("🔄 Searching patients...");
      setPatients([]); // ✅ Clear previous results before fetching new ones
      dispatch(fetchPatients({ name: searchTerm, offset: 0, token, clinicDb }) as any)
        .unwrap()
        .then((data: any) => {
          console.log("✅ Search successful:", data);
          setPatients(data.patients?.data || []);
        })
        .catch((error: any) => console.error("❌ Search failed:", error));
    }
  }, [searchTerm]); // ✅ Now properly resets list when searching

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

  // ✅ Handle "Load More" (Uses Redux offset)
  const handleLoadMore = () => {
    if (!isLoading && token && clinicDb) {
      dispatch(fetchPatients({ name: searchTerm, offset, token, clinicDb }) as any)
        .unwrap()
        .then((data: any) => {
          console.log("✅ Load more successful:", data);
          setPatients((prev) => [...prev, ...data.patients?.data || []]); // ✅ Append new data
        })
        .catch((error: any) => console.error("❌ Load more failed:", error));
    }
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