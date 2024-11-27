import React from 'react';
import TreatmentAccordion from '../TreatmentAccordion';
import { AppointmentTreatment } from '../../../../types/appointmentEvent';
import '../../../../styles/components/TreatmentsTab.scss'

type TreatmentsTabProps = {
  treatments: AppointmentTreatment[];
  onInputChange: (field: string, value: any) => void;
};

const TreatmentsTab: React.FC<TreatmentsTabProps> = ({ treatments, onInputChange }) => {
  const handleEditTreatment = (updatedTreatment: AppointmentTreatment) => {
    const updatedTreatments = treatments.map((t) =>
      t.treatmentId === updatedTreatment.treatmentId ? updatedTreatment : t
    );
    onInputChange('treatments', updatedTreatments);
  };

  const handleRemoveTreatment = (treatmentId: string) => {
    const updatedTreatments = treatments.filter((t) => t.treatmentId !== treatmentId);
    onInputChange('treatments', updatedTreatments);
  };

  const handleAddTreatment = () => {
    const newTreatment: AppointmentTreatment = {
      treatmentId: `new-${Date.now()}`,
      treatmentName: '',
      units: 0,
      involvedTeeth: [],
      prescription: '',
      details: '',
    };
    const updatedTreatments = [...treatments, newTreatment];
    onInputChange('treatments', updatedTreatments);
  };

  return (
    <div>
      <div>
        {treatments.map((treatment) => (
          <TreatmentAccordion
            key={treatment.treatmentId}
            treatment={treatment}
            onEdit={handleEditTreatment}
            onRemove={handleRemoveTreatment}
          />
        ))}
      </div>
      <button onClick={handleAddTreatment}>Add Treatment</button>
    </div>
  );
};

export default TreatmentsTab;
