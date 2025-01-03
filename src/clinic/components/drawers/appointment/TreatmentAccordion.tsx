import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import SearchService from '../../../../shared/services/searchService';
import { AppointmentTreatment } from '../../../types/appointmentEvent';
import '../../../styles/components/TreatmentsTab.scss';

type TreatmentAccordionProps = {
  treatment: AppointmentTreatment;
  onEdit: (updatedTreatment: AppointmentTreatment) => void;
  onRemove: (treatmentId: string) => void;
};

const TreatmentAccordion: React.FC<TreatmentAccordionProps> = ({
  treatment,
  onEdit,
  onRemove,
}) => {
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const database = "demo_db";
  const [searchService] = useState(() => new SearchService(token, database));

  const [isOpen, setIsOpen] = useState(false);
  const [availableTreatments, setAvailableTreatments] = useState<{ treatmentName: string; treatmentId: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState(treatment.treatmentName || '');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleFieldChange = (field: keyof AppointmentTreatment, value: any) => {
    const updatedTreatment = { ...treatment, [field]: value };
    onEdit(updatedTreatment);
  };

  const fetchTreatments = async (query: string) => {
    try {
      const res = await searchService.searchTreatments(query);
      const formattedTreatments = res.map((t: any) => ({
        treatmentName: t.name,
        treatmentId: String(t.id),
      }));
      setAvailableTreatments(formattedTreatments);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };
  
  const handleTreatmentSelect = (treatmentId: string, treatmentName: string) => {
    // Update both treatmentId and treatmentName together
    const updatedTreatment = {
      ...treatment,
      treatmentId,
      treatmentName
    };
    onEdit(updatedTreatment);

    setSearchQuery(treatmentName);
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchQuery) fetchTreatments(searchQuery);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`accordion ${isOpen ? 'open' : ''}`}>
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <h4>{treatment.treatmentName || 'New Treatment'}</h4>
        <div className="accordion-controls">
          <button
            className="remove-button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(treatment.treatmentId);
            }}
            title="Remove Treatment"
          >
            ✖
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="accordion-content">
          <label>
            <span>Search and Select Treatment:</span>
            <input
              type="text"
              placeholder="Search treatments"
              value={searchQuery}
              onFocus={handleInputFocus}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchTreatments(e.target.value);
              }}
            />
            {isFocused && availableTreatments.length > 0 && (
              <ul className="treatment-options" ref={dropdownRef}>
                {availableTreatments.map((t) => (
                  <li
                    key={t.treatmentId}
                    onClick={() => handleTreatmentSelect(t.treatmentId, t.treatmentName)}
                  >
                    {t.treatmentName}
                  </li>
                ))}
              </ul>
            )}
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
              value={(treatment.involvedTeeth || []).join(', ')}
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
              value={treatment.prescription || ''}
              onChange={(e) => handleFieldChange('prescription', e.target.value)}
            ></textarea>
          </label>
          <label>
            <span>Details:</span>
            <textarea
              value={treatment.details || ''}
              onChange={(e) => handleFieldChange('details', e.target.value)}
            ></textarea>
          </label>
        </div>
      )}
    </div>
  );
};

export default TreatmentAccordion;
