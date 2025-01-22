import React, { useEffect, useState } from 'react';
import TreatmentAccordion from '../TreatmentAccordion';
import { AppointmentTreatment } from '@/features/clinic/types/appointmentEvent';
import '@styles-cl/components/TreatmentsTab.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/shared/services/store';
import { updateAppointmentField } from '@/api/appointmentsSlice';
import { v4 as uuidv4 } from 'uuid';

const TreatmentsTab: React.FC = () => {
  const dispatch = useDispatch();
  const treatments: AppointmentTreatment[] = useSelector(
    (state: RootState) => state.appointments.appointmentDetails.treatments
  ) || [];

  // This state stores a localId for each treatment to ensure stable keys.
  const [treatmentsLocalIds, setTreatmentsLocalIds] = useState<string[]>([]);

  // Sync treatmentsLocalIds with treatments whenever treatments change.
  useEffect(() => {
    // If we have fewer localIds than treatments, add new localIds.
    if (treatmentsLocalIds.length < treatments.length) {
      const diff = treatments.length - treatmentsLocalIds.length;
      const newLocalIds = Array.from({ length: diff }, () => uuidv4());
      setTreatmentsLocalIds((prev) => [...prev, ...newLocalIds]);
    }

    // If we have more localIds than treatments (if treatments got removed),
    // we need to remove extra localIds.
    if (treatmentsLocalIds.length > treatments.length) {
      setTreatmentsLocalIds((prev) => prev.slice(0, treatments.length));
    }
  }, [treatments, treatmentsLocalIds.length]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Reorder treatments in the same way we reorder localIds
    const updatedTreatments = [...treatments];
    const [movedTreatment] = updatedTreatments.splice(draggedIndex, 1);
    updatedTreatments.splice(index, 0, movedTreatment);

    const updatedLocalIds = [...treatmentsLocalIds];
    const [movedLocalId] = updatedLocalIds.splice(draggedIndex, 1);
    updatedLocalIds.splice(index, 0, movedLocalId);

    setTreatmentsLocalIds(updatedLocalIds);
    dispatch(updateAppointmentField({ field: 'treatments', value: updatedTreatments }));

    if (index === 0 || draggedIndex === 0) {
      const firstTreatment = updatedTreatments[0] || {};
      dispatch(updateAppointmentField({ field: 'treatmentId', value: firstTreatment.treatmentId || '' }));
      dispatch(updateAppointmentField({ field: 'initialTreatment', value: firstTreatment.treatmentName || '' }));
    }

    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleEditTreatment = (updatedTreatment: AppointmentTreatment, index: number) => {
    const updatedTreatments = [...treatments];
    updatedTreatments[index] = updatedTreatment;

    dispatch(updateAppointmentField({ field: 'treatments', value: updatedTreatments }));

    if (index === 0) {
      dispatch(updateAppointmentField({ field: 'treatmentId', value: updatedTreatment.treatmentId || '' }));
      dispatch(updateAppointmentField({ field: 'initialTreatment', value: updatedTreatment.treatmentName || '' }));
    }
  };

  const handleRemoveTreatment = (index: number) => {
    const updatedTreatments = treatments.filter((_, i) => i !== index);
    const updatedLocalIds = treatmentsLocalIds.filter((_, i) => i !== index);

    setTreatmentsLocalIds(updatedLocalIds);
    dispatch(updateAppointmentField({ field: 'treatments', value: updatedTreatments }));

    if (index === 0 && updatedTreatments.length > 0) {
      const firstTreatment = updatedTreatments[0] || {};
      dispatch(updateAppointmentField({ field: 'treatmentId', value: firstTreatment.treatmentId || '' }));
      dispatch(updateAppointmentField({ field: 'initialTreatment', value: firstTreatment.treatmentName || '' }));
    } else if (index === 0) {
      dispatch(updateAppointmentField({ field: 'treatmentId', value: '' }));
      dispatch(updateAppointmentField({ field: 'initialTreatment', value: '' }));
    }
  };

  const handleAddTreatment = () => {
    const newTreatment: AppointmentTreatment = {
      treatmentId: '',
      treatmentName: '',
      units: 0,
      involvedTeeth: [],
      prescription: '',
      details: '',
    };

    const updatedTreatments = [...treatments, newTreatment];
    const updatedLocalIds = [...treatmentsLocalIds, uuidv4()];

    setTreatmentsLocalIds(updatedLocalIds);
    dispatch(updateAppointmentField({ field: 'treatments', value: updatedTreatments }));

    if (updatedTreatments.length === 1) {
      dispatch(updateAppointmentField({ field: 'treatmentId', value: newTreatment.treatmentId }));
      dispatch(updateAppointmentField({ field: 'initialTreatment', value: newTreatment.treatmentName }));
    }
  };


  return (
    <div className="treatments-tab">
      <div className="treatments-list">
        {treatments.map((treatment, index) => (
          <div
            key={treatmentsLocalIds[index]} // Use localId for stable key from treatmentsLocalIds
            className="draggable-treatment"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDragEnd={handleDragEnd}
          >
            <TreatmentAccordion
              treatment={treatment}
              onEdit={(updatedTreatment) => handleEditTreatment(updatedTreatment, index)}
              onRemove={() => handleRemoveTreatment(index)}
            />
          </div>
        ))}
      </div>
      <button className="add-treatment-button" onClick={handleAddTreatment}>
        Add Treatment
      </button>
    </div>
  );
};

export default TreatmentsTab;
