import React from 'react';
import { Drawer, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { closeDrawer } from '../../../shared/services/drawerSlice';
import MedicDrawer from './MedicDrawer';
import TreatmentDrawer from './TreatmentDrawer';
import StockDrawer from './StockDrawer';
import PatientDrawer from './PatientDrawer';
import AppointmentDrawer from './appointment/AppointmentDrawer';
import UserDrawer from './UserDrawer';

const DrawerContent: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'User':
      return <UserDrawer />;
    case 'Patient':
      return <PatientDrawer />;
    case 'Stock':
      return <StockDrawer />;
    case 'Medic':
      return <MedicDrawer />;
    case 'Treatment':
      return <TreatmentDrawer />;
    case 'Appointment':
      return <AppointmentDrawer />;
    default:
      return <div>No content available</div>;
  }
};

const GlobalDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const { drawers } = useSelector((state: { drawer: { drawers: Array<{ type: string }> } }) => state.drawer);

  const handleClose = () => {
    dispatch(closeDrawer()); // Closes the topmost drawer
  };

  return (
    <>
      {drawers.map((drawer, index) => (
        <Drawer
          key={index}
          anchor="right"
          open
          onClose={handleClose}
          ModalProps={{
            BackdropProps: {
              style: { display: index === drawers.length - 1 ? 'block' : 'none' }, // Only top drawer's backdrop is shown
            },
          }}
        >
          <Box sx={{ width: 400 }}>
            <DrawerContent type={drawer.type} />
          </Box>
        </Drawer>
      ))}
    </>
  );
};

export default GlobalDrawer;
