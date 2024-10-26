import React, { useState, useEffect } from "react";
import { Appointment } from "../../../../types/appointmentEvent";
import SearchService from "../../../../services/searchService";
import { useSelector } from "react-redux";

interface DetailsTabProps {
  appointmentDetails: Appointment;
  onInputChange: (field: keyof Appointment, value: any) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  appointmentDetails,
  onInputChange
}) => {
  const token = useSelector((state: any) => state.auth.subaccountToken); // Fetch token from state
  const database = "demo_db"; // Hardcoded database

  const [medicOptions, setMedicOptions] = useState<string[]>([]);
  const [patientOptions, setPatientOptions] = useState<string[]>([]);
  const [searchService] = useState(() => new SearchService(token, database));

  useEffect(() => {
    // Fetch medics and patients data for autocomplete
    const fetchData = async () => {
      try {
        const medics = await searchService.searchMedics(appointmentDetails.medicUser);
        const patients = await searchService.searchPatients(appointmentDetails.patientUser);
        setMedicOptions(medics.map((medic: any) => medic.name));
        setPatientOptions(patients.map((patient: any) => patient.name));
      } catch (error) {
        console.error("Error fetching medics or patients:", error);
      }
    };
    fetchData();
  }, [appointmentDetails.medicUser, appointmentDetails.patientUser, searchService]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
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

      <label>Medic User</label>
      <input
        type="text"
        list="medicOptions"
        value={appointmentDetails.medicUser}
        onChange={(e) => onInputChange("medicUser", e.target.value)}
      />
      <datalist id="medicOptions">
        {medicOptions.map((medic, index) => (
          <option key={index} value={medic} />
        ))}
      </datalist>

      <label>Patient User</label>
      <input
        type="text"
        list="patientOptions"
        value={appointmentDetails.patientUser}
        onChange={(e) => onInputChange("patientUser", e.target.value)}
      />
      <datalist id="patientOptions">
        {patientOptions.map((patient, index) => (
          <option key={index} value={patient} />
        ))}
      </datalist>

      <label>Initial Treatment</label>
      <input
        type="text"
        value={appointmentDetails.initialTreatment}
        onChange={(e) => onInputChange("initialTreatment", e.target.value)}
      />

      <label>Is Done</label>
      <input
        type="checkbox"
        checked={appointmentDetails.isDone}
        onChange={(e) => onInputChange("isDone", e.target.checked)}
      />
    </div>
  );
};

export default DetailsTab;
