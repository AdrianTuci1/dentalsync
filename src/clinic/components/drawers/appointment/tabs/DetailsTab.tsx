import React, { useState, useEffect, useRef } from "react";
import SearchService from "../../../../../shared/services/searchService";
import { useSelector } from "react-redux";
import { Appointment } from "../../../../types/appointmentEvent";
import Switch from "@mui/material/Switch"; // MUI Switch
import styles from "../../../../styles/drawers/DetailsTab.module.scss";

interface DetailsTabProps {
  appointmentDetails: Appointment;
  onInputChange: (field: keyof Appointment, value: any) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  appointmentDetails,
  onInputChange,
}) => {
  const token = useSelector((state: any) => state.auth.subaccountToken); // Fetch token from state
  const database = "demo_db"; // Hardcoded database

  const [medicOptions, setMedicOptions] = useState<{ name: string; id: number }[]>([]);
  const [patientOptions, setPatientOptions] = useState<{ name: string; id: number }[]>([]);
  const [treatmentOptions, setTreatmentOptions] = useState<{ name: string; id: number }[]>([]);
  const [activeInput, setActiveInput] = useState<string | null>(null); // Track active input
  const [searchService] = useState(() => new SearchService(token, database));

  const dropdownRef = useRef<HTMLUListElement>(null);

  const fetchMedics = (query: string) => {
    searchService
    .searchMedics(query)
    .then((res) => {
      const formattedMedics = res.medics.map((medic: any) => ({
        name: medic.name,
        id: medic.id,
      }));
      setMedicOptions(formattedMedics);
    })
    .catch((err) => console.error("Error fetching medics:", err));  
  };

  const fetchPatients = (query: string) => {
    searchService
      .searchPatients(query)
      .then((res) => {
        const formattedPatients = res.map((patient: any) => ({ name: patient.name, id: patient.id }));
        setPatientOptions(formattedPatients);
      })
      .catch((err) => console.error("Error fetching patients:", err));
  };

  const fetchTreatments = (query: string) => {
    searchService
      .searchTreatments(query)
      .then((res) => {
        const formattedTreatments = res.map((treatment: any) => ({
          name: treatment.name,
          id: treatment.id,
        }));
        setTreatmentOptions(formattedTreatments);
      })
      .catch((err) => console.error("Error fetching treatments:", err));
  };

  // Close dropdown when clicking outside
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
    <div className={styles["details-tab"]}>
      <label>Date</label>
      <input
        type="date"
        value={appointmentDetails.date}
        onChange={(e) => onInputChange("date", e.target.value)}
      />

      <label>Time</label>
      <input
        type="time"
        value={appointmentDetails.time}
        onChange={(e) => onInputChange("time", e.target.value)}
      />

      {/* Medic Input */}
      <label>Medic User</label>
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
                  onInputChange("medicId", medic.id); // Send ID to parent
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
                  onInputChange("patientUser", patient.name);
                  onInputChange("patientId", patient.id); // Send ID to parent
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
      <div className={styles["input-wrapper"]}>
        <input
          type="text"
          value={appointmentDetails.initialTreatment}
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
        {activeInput === "treatment" && treatmentOptions.length > 0 && (
          <ul ref={dropdownRef} className={styles.dropdown}>
            {treatmentOptions.map((treatment, index) => (
              <li
                key={index}
                onClick={() => {
                  onInputChange("initialTreatment", treatment.name);
                  onInputChange("treatmentId", treatment.id); // Send ID to parent
                  setActiveInput(null);
                }}
              >
                {treatment.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles["checkbox-container"]}>
        <label>Is Done</label>
        <Switch
          checked={appointmentDetails.isDone}
          onChange={(e) => onInputChange("isDone", e.target.checked)}
          color="primary"
        />
      </div>
    </div>
  );
};

export default DetailsTab;
