import { Appointment } from "../../../../types/appointmentEvent";

interface PriceTabProps {
    appointmentDetails: Appointment;
    onInputChange: (field: keyof Appointment, value: any) => void;
  }
  
  const PriceTab: React.FC<PriceTabProps> = ({ appointmentDetails, onInputChange }) => {
    return (
      <div>
        <label>Price</label>
        <input
          type="number"
          value={appointmentDetails.price}
          onChange={(e) => onInputChange('price', parseFloat(e.target.value) || 0)}
        />
  
        <label>Paid</label>
        <input
          type="checkbox"
          checked={appointmentDetails.isPaid}
          onChange={(e) => onInputChange('isPaid', e.target.checked)}
        />
      </div>
    );
  };
  
  export default PriceTab;
  