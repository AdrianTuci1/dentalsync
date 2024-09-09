import { useState } from 'react';
import PatientTable from '../../components/PatientTable';
import ActionComponent from '../../components/ActionComponent';
import PatientDetails from '../../components/PatientDetails';
import AddPatientDrawer from '../../components/AddPatientDrawer'; // Adjust the import path as needed

function Patients() {
    const [view, setView] = useState<'list' | 'card'>('list');
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

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <div className="padding-box" style={{display:'flex', alignItems:'center', justifyContent:'center', padding:'0px', width:'100%', height:'calc(100vh - 60px)'}}>
                    <div className="box" style={{display:'flex', width:'100%', height:'100%', borderRadius:'10px', flexDirection:'column'}}>
                        {selectedPatient ? (
                            <PatientDetails patient={selectedPatient} onBackToList={handleBackToList} />
                        ) : (
                            <>
                                <ActionComponent view={view} setView={setView} toggleDrawer={toggleDrawer} />
                                <PatientTable onPatientClick={handlePatientClick} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <AddPatientDrawer open={drawerOpen} onClose={() => toggleDrawer(false)} />
        </>
    );
}

export default Patients;
