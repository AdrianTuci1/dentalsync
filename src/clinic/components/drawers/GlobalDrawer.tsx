import { Drawer, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../../../shared/services/drawerSlice';
import MedicDrawer from './MedicDrawer';
import TreatmentDrawer from './TreatmentDrawer';
import StockDrawer from './StockDrawer';
import PatientDrawer from './PatientDrawer';
import AppointmentDrawer from './appointment/AppointmentDrawer';

const DrawerContent = ({ type }: { type: string; data: any }) => {
  switch (type) {
    case 'Patient':
      return <PatientDrawer />;
    case 'Stock':
      return <StockDrawer />;
    case 'Medic':
      return <MedicDrawer/>;
    case 'Treatment':
      return <TreatmentDrawer />;
    case 'Appointment':
      return <AppointmentDrawer />;
    default:
      return <div>No content available</div>;
  }
};

const GlobalDrawer = () => {
  const dispatch = useDispatch();
  const { isOpen, drawerType, drawerData } = useSelector((state: any) => state.drawer);

  const handleClose = () => dispatch(closeDrawer());

  return (
    <Drawer anchor="right" open={isOpen} onClose={handleClose} key={drawerType}>
      <Box sx={{ width: 400, p: 2 }}>
        <DrawerContent type={drawerType} data={drawerData} />
      </Box>
    </Drawer>
  );
};

export default GlobalDrawer;
