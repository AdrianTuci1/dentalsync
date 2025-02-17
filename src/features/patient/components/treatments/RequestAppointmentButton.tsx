import React from 'react';
import { Button, Dialog, Drawer, useMediaQuery } from '@mui/material';
import RequestAppointment from '../request/RequestAppointment';
import { useSelector, useDispatch } from 'react-redux';
import { closeRequestAppointment, openRequestAppointment } from '@/api/slices/requestSlice';
import '../../styles/requestButton.scss';
import { RootState } from '@/shared/services/store';

const RequestAppointmentButton: React.FC = () => {
    const dispatch = useDispatch();
    const openAppointment = useSelector((state: RootState) => state.request.openAppointment);

    const isLargeScreen = useMediaQuery('(min-width:850px)');

    const handleCloseAppointment = () => {
        dispatch(closeRequestAppointment());
    };

    return (
        <div className="button-cas">
            <Button
                variant="contained"
                color="primary"
                className="request-appointment-button"
                onClick={() => dispatch(openRequestAppointment())}
            >
                Request Appointment
            </Button>

            {isLargeScreen ? (
                <Drawer
                    anchor="right"
                    open={openAppointment}
                    onClose={handleCloseAppointment}
                    PaperProps={{
                        style: { width: 400 },
                    }}
                >
                    <RequestAppointment onExit={handleCloseAppointment} />
                </Drawer>
            ) : (
                <Dialog
                    open={openAppointment}
                    onClose={handleCloseAppointment}
                    fullScreen
                >
                    <RequestAppointment onExit={handleCloseAppointment} />
                </Dialog>
            )}
        </div>
    );
};

export default RequestAppointmentButton;
