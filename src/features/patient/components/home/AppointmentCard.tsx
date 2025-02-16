import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AppointmentCard.module.scss";

interface Appointment {
  appointmentId: string;
  medicPhoto: string;
  medicName: string;
  medicId: string;
  time: string;
  treatmentName: string;
  date: string;
}

const AppointmentCard: React.FC = () => {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // Dummy Data for Now (Later Replace with API Call)
  useEffect(() => {
    const fetchAppointment = async () => {
      // Simulating API call with dummy data
      const dummyAppointment: Appointment = {
        appointmentId: "12345",
        medicPhoto: "/avatar1.avif",
        medicName: "Dr. John Doe",
        medicId: "M001",
        time: "10:30 AM",
        treatmentName: "Teeth Cleaning",
        date: "March 15, 2024",
      };
      setAppointment(dummyAppointment);
    };

    fetchAppointment();
  }, []);

  if (!appointment) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.card} onClick={() => navigate(`/appointments/${appointment.appointmentId}`)}>
        <div className={styles.cardContent}>
      {/* First Row: Medic Info + Time */}
      <div className={styles.row}>
        <div className={styles.medicInfo}>
          <img src={appointment.medicPhoto} alt={appointment.medicName} className={styles.medicPhoto} />
          <span className={styles.medicName}>{appointment.medicName}</span>
        </div>
        <span className={styles.time}>{appointment.time}</span>
      </div>

      {/* Second Row: Treatment Name + Date + Details */}
      <div className={styles.row}>
        <div className={styles.treatmentInfo}>
          <span className={styles.treatmentName}>{appointment.treatmentName}</span>
          <span className={styles.date}>{appointment.date}</span>
        </div>
        <span className={styles.details}>Details →</span>
      </div>
      </div>
    </div>
  );
};

export default AppointmentCard;