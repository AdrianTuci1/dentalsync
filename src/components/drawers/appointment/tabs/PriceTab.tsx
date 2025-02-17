import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/shared/services/store';
import { updateAppointmentField } from '@/api/slices/appointmentsSlice';
import styles from '@styles-cl/drawers/PriceTab.module.scss'

const PriceTab: React.FC = () => {
  const dispatch = useDispatch();
  const appointmentDetails = useSelector(
    (state: RootState) => state.appointments.appointmentDetails
  );

  const handleInputChange = (field: keyof typeof appointmentDetails, value: any) => {
    dispatch(updateAppointmentField({ field, value }));
  };

  if (!appointmentDetails) {
    return <div className={styles['price-tab']}>Loading...</div>;
  }

  return (
    <div className={styles['price-tab']}>
      <div className={styles['input-group']}>
        <label>Recommended Price:</label>
        <span className={styles['recommended-price']}>
          {appointmentDetails.price}
        </span>
      </div>

      <div className={styles['input-group']}>
        <label>Your Price</label>
        <input
          type="number"
          value={appointmentDetails.price}
          onChange={(e) =>
            handleInputChange('price', parseFloat(e.target.value) || 0)
          }
        />
      </div>

      <div className={styles['input-group']}>
        <label>Paid</label>
        <input
          type="checkbox"
          checked={appointmentDetails.isPaid}
          onChange={(e) => handleInputChange('isPaid', e.target.checked)}
        />
      </div>

      <div className={styles['button-group']}>
        <button className={styles['print-button']} onClick={() => console.log('Print receipt')}>
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default PriceTab;
