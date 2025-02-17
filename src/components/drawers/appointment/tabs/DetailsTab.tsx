import React, { useState, useEffect, useRef } from 'react';
import SearchService from '@/api/services/searchService';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/shared/services/store';
import { updateAppointmentField } from '@/api/slices/appointmentsSlice';
import Switch from '@mui/material/Switch'; // MUI Switch
import styles from '@styles-cl/drawers/DetailsTab.module.scss';

const DetailsTab: React.FC = () => {
  const dispatch = useDispatch();
  const appointmentDetails = useSelector(
    (state: RootState) => state.appointments.appointmentDetails
  );
  const token = useSelector((state: RootState) => state.auth.subaccountToken);
  const database = 'demo_db';

  // Interfaces for options
  interface MedicOption {
    id: number;
    name: string;
  }

  interface PatientOption {
    id: number;
    name: string;
  }

  interface TreatmentOption {
    id: number;
    name: string;
  }

  const [medicOptions, setMedicOptions] = useState<MedicOption[]>([]);
  const [patientOptions, setPatientOptions] = useState<PatientOption[]>([]);
  const [treatmentOptions, setTreatmentOptions] = useState<TreatmentOption[]>([]);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const searchServiceRef = useRef<SearchService | null>(null);

  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (token) {
      searchServiceRef.current = new SearchService(token, database);
    }
  }, [token]);

  const fetchMedics = (query: string) => {
    if (!searchServiceRef.current) return;
    searchServiceRef.current
      .searchMedics(query)
      .then((res) => {
        const formattedMedics = res.medics.map((medic: any) => ({
          name: medic.name,
          id: medic.id,
        }));
        setMedicOptions(formattedMedics);
      })
      .catch((err) => console.error('Error fetching medics:', err));
  };

  const fetchPatients = (query: string) => {
    if (!searchServiceRef.current) return;
    searchServiceRef.current
      .searchPatients(query)
      .then((res) => {
        const formattedPatients = res.map((patient: any) => ({
          name: patient.name,
          id: patient.id,
        }));
        setPatientOptions(formattedPatients);
      })
      .catch((err) => console.error('Error fetching patients:', err));
  };

  const fetchTreatments = (query: string) => {
    if (!searchServiceRef.current) return;
    searchServiceRef.current
      .searchTreatments(query)
      .then((res) => {
        const formattedTreatments = res.map((treatment: any) => ({
          name: treatment.name,
          id: treatment.id,
        }));
        setTreatmentOptions(formattedTreatments);
      })
      .catch((err) => console.error('Error fetching treatments:', err));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveInput(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof typeof appointmentDetails, value: any) => {
    dispatch(updateAppointmentField({ field, value }));
  };

  if (!appointmentDetails) {
    return <div>Loading...</div>;
  }

  console.log(appointmentDetails)

  return (
    <div className={styles['details-tab']}>
      <label>Date</label>
      <input
        type="date"
        value={appointmentDetails.date || ''}
        onChange={(e) => handleInputChange('date', e.target.value)}
      />

      <label>Time</label>
      <input
        type="time"
        value={appointmentDetails.time || ''}
        onChange={(e) => handleInputChange('time', e.target.value)}
      />

      {/* Medic Input */}
      <label>Medic User</label>
      <div className={styles['input-wrapper']}>
        <input
          type="text"
          value={appointmentDetails.medicUser || ''}
          placeholder="Search Medic"
          onFocus={() => {
            setActiveInput('medic');
            fetchMedics('');
          }}
          onChange={(e) => {
            handleInputChange('medicUser', e.target.value);
            fetchMedics(e.target.value);
          }}
        />
        {activeInput === 'medic' && medicOptions.length > 0 && (
          <ul ref={dropdownRef} className={styles.dropdown}>
            {medicOptions.map((medic) => (
              <li
                key={medic.id}
                onClick={() => {
                  handleInputChange('medicUser', medic.name);
                  handleInputChange('medicId', medic.id); // Send ID to state
                  setActiveInput(null);
                }}
              >
                {medic.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Patient Input */}
      <label>Patient User</label>
      <div className={styles['input-wrapper']}>
        <input
          type="text"
          value={appointmentDetails.patientUser || ''}
          placeholder="Search Patient"
          onFocus={() => {
            setActiveInput('patient');
            fetchPatients('');
          }}
          onChange={(e) => {
            handleInputChange('patientUser', e.target.value);
            fetchPatients(e.target.value);
          }}
        />
        {activeInput === 'patient' && patientOptions.length > 0 && (
          <ul ref={dropdownRef} className={styles.dropdown}>
            {patientOptions.map((patient) => (
              <li
                key={patient.id}
                onClick={() => {
                  handleInputChange('patientUser', patient.name);
                  handleInputChange('patientId', patient.id); // Send ID to state
                  setActiveInput(null);
                }}
              >
                {patient.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Treatment Input */}
      <label>Initial Treatment</label>
      <div className={styles['input-wrapper']}>
        <input
          type="text"
          value={appointmentDetails.initialTreatment || ''}
          placeholder="Search Treatment"
          onFocus={() => {
            setActiveInput('treatment');
            fetchTreatments('');
          }}
          onChange={(e) => {
            handleInputChange('initialTreatment', e.target.value);
            fetchTreatments(e.target.value);
          }}
        />
        {activeInput === 'treatment' && treatmentOptions.length > 0 && (
          <ul ref={dropdownRef} className={styles.dropdown}>
            {treatmentOptions.map((treatment) => (
              <li
                key={treatment.id}
                onClick={() => {
                  handleInputChange('initialTreatment', treatment.name);
                  handleInputChange('treatmentId', treatment.id); // Send ID to state
                  setActiveInput(null);
                }}
              >
                {treatment.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles['checkbox-container']}>
        <label>Is Done</label>
        <Switch
          checked={appointmentDetails.isDone || false}
          onChange={(e) => handleInputChange('isDone', e.target.checked)}
          color="primary"
        />
      </div>
    </div>
  );
};

export default DetailsTab;
