import React, { useState, useEffect, useRef } from 'react';
import { Appointment } from '../../../../types/appointmentEvent';
import SearchService from '../../../../../shared/services/searchService';
import AppointmentService from '../../../../../shared/services/fetchAppointments'; // Make sure this path is correct
import styles from '../../../../styles/drawers/InitialAppointmentTab.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../../shared/services/hooks';
import { RootState } from '../../../../../shared/services/store';
import { updateAppointmentField, resetAppointment } from '../../../../../shared/services/appointmentsSlice';
import { closeDrawer } from '../../../../../shared/services/drawerSlice';

const InitialAppointmentTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const appointmentDetails = useAppSelector(
    (state: RootState) => state.appointments.appointmentDetails
  );
  const token = useAppSelector((state: RootState) => state.auth.subaccountToken);
  const database = 'demo_db';

  const [medicOptions, setMedicOptions] = useState<any[]>([]);
  const [patientOptions, setPatientOptions] = useState<{ name: string; id: number }[]>([]);
  const [treatmentOptions, setTreatmentOptions] = useState<any[] | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  
  const searchServiceRef = useRef(new SearchService(token || "", database));
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleInputChange = (field: keyof Appointment, value: any) => {
    dispatch(updateAppointmentField({ field, value }));
  };

  const handleCancel = () => {
    dispatch(resetAppointment());
    dispatch(closeDrawer());
  };

  const handleSave = async () => {
    try {
      // Instead of dispatching createAppointment thunk, call the service directly
      const appointmentService = new AppointmentService(token || '', database);

      // Ensure appointmentDetails contains the required fields for creation
      const createdAppointment = await appointmentService.createAppointment(appointmentDetails);
      console.log('Appointment successfully created:', createdAppointment);

      // After successful creation, reset and close
      dispatch(resetAppointment());
      dispatch(closeDrawer());
    } catch (error) {
      console.error('Error creating appointment:', error);
      console.log(appointmentDetails);
    }
  };

  // Fetch functions for patients, medics, and treatments remain unchanged
  const fetchPatients = (query: string) => {
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
    searchServiceRef.current
      .searchTreatments(query)
      .then((res) => setTreatmentOptions(res ?? []))
      .catch((err) => console.error('Error fetching treatments:', err));
  };

  const fetchMedics = (query: string) => {
    const { date, time, initialTreatment } = appointmentDetails;
    if (!date || !time || !initialTreatment) {
      setAvailabilityMessage('Please select date, time, and treatment first.');
      return;
    }

    const selectedTreatment = treatmentOptions?.find((t: any) => t.name === initialTreatment);
    const duration = selectedTreatment?.duration;

    if (!duration) {
      setAvailabilityMessage('Please select a valid treatment with a duration.');
      return;
    }

    searchServiceRef.current
      .searchMedics(query, date, time, duration)
      .then((res) => {
        setMedicOptions(res.medics ?? []);
        setAvailabilityMessage(null);
      })
      .catch((err) => {
        console.error('Error fetching medics:', err);
        setAvailabilityMessage('Error fetching medic availability.');
      });
  };

  const fetchAvailability = (medicId: number) => {
    const { date, time, initialTreatment } = appointmentDetails;

    if (!date || !time || !initialTreatment) {
      setAvailabilityMessage('Please select date, time, and treatment first.');
      return;
    }

    const selectedTreatment = treatmentOptions?.find((t: any) => t.name === initialTreatment);
    const duration = selectedTreatment?.duration;

    if (!duration) {
      setAvailabilityMessage('Please select a valid treatment with a duration.');
      return;
    }

    searchServiceRef.current
      .searchMedics('', date, time, duration, medicId)
      .then((res) => {
        setAvailabilityMessage(res.message || 'No availability information.');
      })
      .catch((err) => {
        console.error('Error checking medic availability:', err);
        setAvailabilityMessage('Error checking medic availability.');
      });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveInput(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles['initial-tab']}>
      <div>
        <label>Patient User</label>
        <div className={styles['input-wrapper']}>
          <input
            type="text"
            value={appointmentDetails.patientUser}
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
                    handleInputChange('patientId', patient.id);
                    setActiveInput(null);
                  }}
                >
                  {patient.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <label>Date</label>
        <input
          type="date"
          value={appointmentDetails.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
        />
      </div>

      <div>
        <label>Time</label>
        <input
          type="time"
          value={appointmentDetails.time}
          onChange={(e) => handleInputChange('time', e.target.value)}
        />
      </div>

      <div>
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
          {activeInput === 'treatment' &&
            treatmentOptions &&
            treatmentOptions.length > 0 && (
              <ul ref={dropdownRef} className={styles.dropdown}>
                {treatmentOptions.map((treatment) => (
                  <li
                    key={treatment.id}
                    onClick={() => {
                      handleInputChange('initialTreatment', treatment.name);
                      handleInputChange('treatmentId', treatment.id);
                      setActiveInput(null);
                    }}
                  >
                    {treatment.name}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>

      <div>
        <label>Medic User</label>
        {availabilityMessage && (
          <p className={styles['availability-message']}>
            {availabilityMessage}
          </p>
        )}
        <div className={styles['input-wrapper']}>
          <input
            type="text"
            value={appointmentDetails.medicUser}
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
                    handleInputChange('medicId', medic.id);
                    setActiveInput(null);
                    fetchAvailability(medic.id);
                  }}
                >
                  {medic.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles['button-group']}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default InitialAppointmentTab;
