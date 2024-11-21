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
  const token = useSelector((state: any) => state.auth.subaccountToken); // Fetch token from state
  const database = "demo_db"; // Hardcoded database

  const [medicOptions, setMedicOptions] = useState<string[]>([]);
  const [patientOptions, setPatientOptions] = useState<string[]>([]);
  const [treatmentOptions, setTreatmentOptions] = useState<string[]>([]);
  const [activeInput, setActiveInput] = useState<string | null>(null); // Track active input
  const [searchService] = useState(() => new SearchService(token, database)); // Initialize service

  const dropdownRef = useRef<HTMLUListElement>(null);

  const fetchMedics = (query: string) => {
    searchService
      .searchMedics(query)
      .then((res) => setMedicOptions(res.map((medic: any) => medic.name)))
      .catch((err) => console.error("Error fetching medics:", err));
  };

  const fetchPatients = (query: string) => {
    searchService
      .searchPatients(query)
      .then((res) => setPatientOptions(res.map((patient: any) => patient.name)))
      .catch((err) => console.error("Error fetching patients:", err));
  };

  const fetchTreatments = (query: string) => {
    searchService
      .searchTreatments(query)
      .then((res) => setTreatmentOptions(res.map((treatment: any) => treatment.name)))
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
    <div className={styles["initial-tab"]}>
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
                    onInputChange("patientUser", patient);
                    setActiveInput(null);
                  }}
                >
                  {patient}
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
          onChange={(e) => onInputChange("date", e.target.value)}
        />
      </div>

      <div>
        <label>Time</label>
        <input
          type="time"
          value={appointmentDetails.time}
          onChange={(e) => onInputChange("time", e.target.value)}
        />
      </div>

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
          {activeInput === "treatment" && treatmentOptions.length > 0 && (
            <ul ref={dropdownRef} className={styles.dropdown}>
              {treatmentOptions.map((treatment, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onInputChange("initialTreatment", treatment);
                    setActiveInput(null);
                  }}
                >
                  {treatment}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
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
                    onInputChange("medicUser", medic);
                    setActiveInput(null);
                  }}
                >
                  {medic}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <button onClick={onSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default InitialAppointmentTab;
