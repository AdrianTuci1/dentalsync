import { Appointment } from "../../../../types/appointmentEvent";

interface DetailsTabProps {
    appointmentDetails: Appointment;
    onInputChange: (field: keyof Appointment, value: any) => void;
  }
  
  const DetailsTab: React.FC<DetailsTabProps> = ({ appointmentDetails, onInputChange }) => {
    return (
      <div>
        <label>Date</label>
        <input
          type="date"
          value={appointmentDetails.date}
          onChange={(e) => onInputChange('date', e.target.value)}
        />
  
        <label>Time</label>
        <input
          type="time"
          value={appointmentDetails.time}
          onChange={(e) => onInputChange('time', e.target.value)}
        />
  
        <label>Medic User</label>
        <input
          type="text"
          value={appointmentDetails.medicUser}
          onChange={(e) => onInputChange('medicUser', e.target.value)}
        />
      </div>
    );
  };
  
  export default DetailsTab;
  