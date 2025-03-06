import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeRequestAppointment } from '@/api/slices/requestSlice';
import styles from './RequestDrawer.module.css';
import StepAuthentication from './steps/StepAuthentication';
import StepCalendar from './steps/StepCalendar';
import StepTimeSlots from './steps/StepTimeSlots';
import StepReason from './steps/StepReason';
import { RootState } from '@/shared/services/store';


const RequestDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const requestState = useSelector((state: RootState) => state.request); // ✅ Schimbat din appointment în request

  if (!requestState) return null;

  const { openAppointment, step } = requestState;

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepAuthentication />;
      case 1:
        return <StepCalendar />;
      case 2:
        return <StepTimeSlots />;
      case 3:
        return <StepReason />;
      default:
        return <StepAuthentication />;
    }
  };

  return (
    <div className={`${styles.overlay} ${openAppointment ? styles.open : ""}`} onClick={() => dispatch(closeRequestAppointment())}>
      <div
        className={styles.drawer}
        style={{
          width: window.innerWidth <= 1024 ? "100%" : "360px",
          right: openAppointment ? "0" : "-100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={() => dispatch(closeRequestAppointment())}>
          ✕
        </button>
        {renderStep()}
      </div>
    </div>
  );
};

export default RequestDrawer;