import React, { useState, useEffect, useRef } from "react";
import { Appointment } from "../../../../types/appointmentEvent";
import SearchService from "../../../../../shared/services/searchService";
import styles from "../../../../styles/drawers/InitialAppointmentTab.module.scss";
import { useSelector } from "react-redux";

interface InitialAppointmentTabProps {
  appointmentDetails: Appointment;
  onInputChange: (field: keyof Appointment, value: any) => void;
  onSave: () => void;
  onClose: () => void;
}

const InitialAppointmentTab: React.FC<InitialAppointmentTabProps> = ({
  appointmentDetails,
  onInputChange,
  onSave,
  onClose,
}) => {
  const token = useSelector((state: any) => state.auth.subaccountToken);
  const database = "demo_db";

  const [medicOptions, setMedicOptions] = useState<any[]>([]);
  const [patientOptions, setPatientOptions] = useState<{ name: string; id: number }[]>([]);
  const [treatmentOptions, setTreatmentOptions] = useState<any[] | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [searchService] = useState(() => new SearchService(token, database));

  const dropdownRef = useRef<HTMLUListElement>(null);

  const fetchMedics = (query: string) => {
    const { date, time, initialTreatment } = appointmentDetails;

    if (!date || !time || !initialTreatment) {
      setAvailabilityMessage("Please select date, time, and treatment first.");
      return;
    }

    const selectedTreatment = treatmentOptions?.find(
      (treatment) => treatment.name === initialTreatment
    );

    const duration = selectedTreatment?.duration;

    if (!duration) {
      setAvailabilityMessage("Please select a valid treatment with a duration.");
      return;
    }

    searchService
      .searchMedics(query, date, time, duration)
      .then((res) => {
        setMedicOptions(res.medics ?? []);
        setAvailabilityMessage(null); // Reset availability message during search
      })
      .catch((err) => {
        console.error("Error fetching medics:", err);
        setAvailabilityMessage("Error fetching medic availability.");
      });
  };

  const fetchAvailability = (medicId: number) => {
    const { date, time, initialTreatment } = appointmentDetails;

    if (!date || !time || !initialTreatment) {
      setAvailabilityMessage("Please select date, time, and treatment first.");
      return;
    }

    const selectedTreatment = treatmentOptions?.find(
      (treatment) => treatment.name === initialTreatment
    );

    const duration = selectedTreatment?.duration;
    const treatmentId = selectedTreatment?.id;

    if (!duration) {
      setAvailabilityMessage("Please select a valid treatment with a duration.");
      return;
    }

    console.log(medicId)
    console.log(treatmentId)
    
    searchService
    .searchMedics("", date, time, duration, medicId) // Include medicId to check availability
    .then((res) => {
      setAvailabilityMessage(res.message || "No availability information.");
    })
    .catch((err) => {
      console.error("Error checking medic availability:", err);
      setAvailabilityMessage("Error checking medic availability.");
    });
  };

  const fetchPatients = (query: string) => {
    searchService
      .searchPatients(query)
      .then((res) => {
        // Ensure the result is an array of objects with `name` and `id`
        const formattedPatients = res.map((patient: any) => ({
          name: patient.name,
          id: patient.id,
        }));
        setPatientOptions(formattedPatients);
      })
      .catch((err) => console.error("Error fetching patients:", err));
  };
  

  const fetchTreatments = (query: string) => {
    searchService
      .searchTreatments(query)
      .then((res) => setTreatmentOptions(res ?? []))
      .catch((err) => console.error("Error fetching treatments:", err));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveInput(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles["initial-tab"]}>
      {/* Patient Input */}
      <div>
        <label>Patient User</label>
        <div className={styles["input-wrapper"]}>
          <input
            type="text"
            value={appointmentDetails.patientUser}
            placeholder="Search Patient"
            onFocus={() => {
              setActiveInput("patient");
              fetchPatients("");
            }}
            onChange={(e) => {
              onInputChange("patientUser", e.target.value);
              fetchPatients(e.target.value);
            }}
          />
          {activeInput === "patient" && patientOptions.length > 0 && (
            <ul ref={dropdownRef} className={styles.dropdown}>
              {patientOptions.map((patient, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onInputChange("patientUser", patient.name); // Send name
                    onInputChange("patientId", patient.id); // Send ID
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

      {/* Date Input */}
      <div>
        <label>Date</label>
        <input
          type="date"
          value={appointmentDetails.date}
          onChange={(e) => onInputChange("date", e.target.value)}
        />
      </div>

      {/* Time Input */}
      <div>
        <label>Time</label>
        <input
          type="time"
          value={appointmentDetails.time}
          onChange={(e) => onInputChange("time", e.target.value)}
        />
      </div>

      {/* Treatment Input */}
      <div>
        <label>Initial Treatment</label>
        <div className={styles["input-wrapper"]}>
          <input
            type="text"
            value={appointmentDetails.initialTreatment || ""}
            placeholder="Search Treatment"
            onFocus={() => {
              setActiveInput("treatment");
              fetchTreatments("");
            }}
            onChange={(e) => {
              onInputChange("initialTreatment", e.target.value);
              fetchTreatments(e.target.value);
            }}
          />
          {activeInput === "treatment" && treatmentOptions && treatmentOptions.length > 0 && (
            <ul ref={dropdownRef} className={styles.dropdown}>
              {treatmentOptions.map((treatment, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onInputChange("initialTreatment", treatment.name);
                    onInputChange("treatmentId", treatment.id)
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

      {/* Medic Input */}
      <div>
        <label>Medic User</label>
        {availabilityMessage && <p className={styles["availability-message"]}>{availabilityMessage}</p>}
        <div className={styles["input-wrapper"]}>
          <input
            type="text"
            value={appointmentDetails.medicUser}
            placeholder="Search Medic"
            onFocus={() => {
              setActiveInput("medic");
              fetchMedics("");
            }}
            onChange={(e) => {
              onInputChange("medicUser", e.target.value);
              fetchMedics(e.target.value);
            }}
          />
          {activeInput === "medic" && medicOptions.length > 0 && (
            <ul ref={dropdownRef} className={styles.dropdown}>
              {medicOptions.map((medic, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onInputChange("medicUser", medic.name);
                    onInputChange("medicId", medic.id);
                    setActiveInput(null);
                    fetchAvailability(medic.id); // Fetch availability after selecting a medic
                  }}
                >
                  {medic.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div>
        <button onClick={onSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default InitialAppointmentTab;
