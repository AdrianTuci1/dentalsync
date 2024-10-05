import { Appointment } from "../../../../types/appointmentEvent";
import styles from '../../../../styles/drawers/InitialAppointmentTab.module.scss'

interface InitialAppointmentTabProps {
    appointmentDetails: Appointment;
    onInputChange: (field: keyof Appointment, value: any) => void;
    onSave: () => void;
    onClose: () => void;
  }
  
  const InitialAppointmentTab: React.FC<InitialAppointmentTabProps> = ({
    appointmentDetails,
    onInputChange,
    onSave,
    onClose,
  }) => {
    return (
        <div className={styles["initial-tab"]}>
        <div>
            <label>Patient User</label>
            <input
            type="text"
            value={appointmentDetails.patientUser}
            onChange={(e) => onInputChange('patientUser', e.target.value)}
            />
        </div>
        <div>
            <label>Date</label>
            <input
            type="date"
            value={appointmentDetails.date}
            onChange={(e) => onInputChange('date', e.target.value)}
            />
        </div>
        <div>
            <label>Time</label>
            <input
            type="time"
            value={appointmentDetails.time}
            onChange={(e) => onInputChange('time', e.target.value)}
            />
        </div>
        <div>
            <label>Initial Treatment</label>
            <input
            type="text"
            value={appointmentDetails.initialTreatment || ''}
            onChange={(e) => onInputChange('initialTreatment', e.target.value)}
            />
        </div>
        <div>
            <label>Medic User</label>
            <input
            type="text"
            value={appointmentDetails.medicUser}
            onChange={(e) => onInputChange('medicUser', e.target.value)}
            />
        </div>
        <div>
            <button onClick={onSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
        </div>

    );
  };
  
  export default InitialAppointmentTab;
  