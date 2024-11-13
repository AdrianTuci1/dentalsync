import { Appointment } from "../../../../types/appointmentEvent";

interface TreatmentsTabProps {
    appointmentId: string;
    onInputChange: (field: keyof Appointment, value: any) => void;
  }
  
  const TreatmentsTab: React.FC<TreatmentsTabProps> = ({ appointmentId, onInputChange }) => {
    // You can add logic here to fetch treatments and display them
    return (
      <div>
        <label>Appointment ID</label>
        <input type="text" value={appointmentId} readOnly />
  
        {/* Other fields for treatments */}
      </div>
    );
  };
  
  export default TreatmentsTab;
  