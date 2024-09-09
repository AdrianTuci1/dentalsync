import React, { useState } from 'react';
import TeethPermanentChart from '../../DentalChart';
import { Tooth } from '../../../types/tooth';

const TreatmentPlan: React.FC = () => {
  const [teeth, setTeeth] = useState<Tooth[]>([
    { id: 11, condition: 'healthy', variant: 1 },
    { id: 12, condition: 'cavity', variant: 2 },
    // Initialize more teeth
  ]);

  const handleClick = (ISONumber: number) => {
    console.log('Tooth clicked:', ISONumber);
    // Handle click logic here (e.g., change tooth condition or variant)
  };

  return (
    <div>
      <h3>Treatment Plan</h3>
      {/* Form fields for treatment plan */}
      <TeethPermanentChart teeth={teeth}/>
    </div>
  );
};

export default TreatmentPlan;
