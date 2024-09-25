import { useState } from 'react';
import PatientTable from '../../components/PatientTable';
import ActionComponent from '../../components/ActionComponent';
import PatientDetails from '../../components/PatientDetails';
import PatientDrawer from '../../components/drawers/PatientDrawer';



function Patients() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

    const toggleDrawer = (open: boolean) => {
        setDrawerOpen(open);
    };

    const handlePatientClick = (patient: any) => {
        setSelectedPatient(patient);
    };

    const handleBackToList = () => {
        setSelectedPatient(null);
    };

    const patientData = {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        avatarUrl: 'john-doe-avatar.png',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        address: '123 Main St, Anytown, USA',
        labels: ['VIP', 'Allergic to penicillin'],
        notes: 'Requires gentle handling due to anxiety.',
      };


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <div className="padding-box" style={{display:'flex', alignItems:'center', justifyContent:'center', padding:'0px', width:'100%', height:'calc(100vh - 60px)'}}>
                    <div className="box" style={{display:'flex', width:'100%', height:'100%', borderRadius:'10px', flexDirection:'column'}}>
                        {selectedPatient ? (
                            <PatientDetails patient={selectedPatient} onBackToList={handleBackToList} />
                        ) : (
                            <>
                                <ActionComponent toggleDrawer={toggleDrawer} />
                                <PatientTable onPatientClick={handlePatientClick} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <PatientDrawer
                patient={patientData}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
      />
        </>
    );
}

export default Patients;
