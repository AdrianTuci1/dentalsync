import { useState } from 'react';
import PatientTable from '../../components/PatientTable';
import ActionComponent from '../../components/ActionComponent';
import PatientDrawer from '../../components/drawers/PatientDrawer';

function Patients() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const toggleDrawer = (open: boolean, patientId: string | null = null) => {
    setSelectedPatient(patientId);
    setDrawerOpen(open);
  };

  const handlePatientClick = (patientId: string) => {
    toggleDrawer(true, patientId);
  };

  const handleDrawerClose = () => {
    setSelectedPatient(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <div
          className="padding-box"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px', width: '100%', height: 'calc(100vh - 60px)' }}
        >
          <div className="box" style={{ display: 'flex', width: '100%', height: '100%', borderRadius: '10px', flexDirection: 'column' }}>
            <ActionComponent toggleDrawer={() => toggleDrawer(true)} />  {/* Opens with empty form */}
            <PatientTable onPatientClick={handlePatientClick} />
          </div>
        </div>
      </div>

      <PatientDrawer
        patientId={selectedPatient}
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
      />
    </>
  );
}

export default Patients;
