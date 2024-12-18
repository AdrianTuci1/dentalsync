import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '../../shared/services/drawerSlice'; // Redux action
import PatientService from '../../shared/services/patientService';
import PatientTable from '../components/PatientTable';
import ActionComponent from '../components/ActionComponent';
import { getSubdomain } from '../../shared/utils/getSubdomains';

const Patients: React.FC = () => {
    const dispatch = useDispatch();
    const [patients, setPatients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Search input
    const [offset, setOffset] = useState<number>(0); // Offset for pagination
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const token = useSelector((state: any) => state.auth.subaccountToken);

    const db = getSubdomain()

    const patientService = new PatientService(token, `${db}_db`); // Replace with actual token/db

    // Fetch patients from API
    const fetchPatients = async (reset = false) => {
        setIsLoading(true);
        try {
            const response = await patientService.getPatients(searchTerm, reset ? 0 : offset);
            const newPatients = response.data;

            setPatients((prev) => (reset ? newPatients : [...prev, ...newPatients])); // Reset or append
            setOffset(response.offset); // Update offset for next fetch
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch initial patients on mount
    useEffect(() => {
        fetchPatients(true);
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
        setOffset(0);
        fetchPatients(true); // Reset the patient list with the new search term
    };

    // Handle "Load More"
    const handleLoadMore = () => {
        fetchPatients();
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
