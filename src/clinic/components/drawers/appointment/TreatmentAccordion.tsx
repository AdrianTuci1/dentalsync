import React from 'react';
import { AppointmentTreatment } from '../../../types/appointmentEvent';

type TreatmentAccordionProps = {
  treatment: AppointmentTreatment;
  onEdit: (updatedTreatment: AppointmentTreatment) => void;
  onRemove: (treatmentId: string) => void;
};


const TreatmentAccordion: React.FC<TreatmentAccordionProps> = ({ treatment, onEdit, onRemove }) => {
    const handleFieldChange = (field: keyof AppointmentTreatment, value: string | number | string[]) => {
      onEdit({ ...treatment, [field]: value });
    };
  
    return (
      <div className="accordion">
        <div className="accordion-header">
          <h4>{treatment.treatmentName || 'New Treatment'}</h4>
          <button
            className="remove-button"
            onClick={() => onRemove(treatment.treatmentId)}
            title="Remove Treatment"
          >
            ✖
          </button>
        </div>
        <div className="accordion-content">
          <label>
            <span>Treatment Name:</span>
            <input
              type="text"
              value={treatment.treatmentName}
              onChange={(e) => handleFieldChange('treatmentName', e.target.value)}
            />
          </label>
          <label>
            <span>Units:</span>
            <input
              type="number"
              value={treatment.units}
              onChange={(e) => handleFieldChange('units', Number(e.target.value))}
            />
          </label>
          <label>
            <span>Involved Teeth (comma-separated):</span>
            <input
              type="text"
              value={(treatment.involvedTeeth || []).join(', ')} // Default to an empty array
              onChange={(e) =>
                handleFieldChange(
                  'involvedTeeth',
                  e.target.value.split(',').map((t) => t.trim())
                )
              }
            />
          </label>
          <label>
            <span>Prescription:</span>
            <textarea
              value={treatment.prescription || ''} // Default to an empty string
              onChange={(e) => handleFieldChange('prescription', e.target.value)}
            ></textarea>
          </label>
          <label>
            <span>Details:</span>
            <textarea
              value={treatment.details || ''} // Default to an empty string
              onChange={(e) => handleFieldChange('details', e.target.value)}
            ></textarea>
          </label>
        </div>
      </div>
    );
  };
  
  export default TreatmentAccordion;