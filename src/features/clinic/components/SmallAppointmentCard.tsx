import React from "react";
import "../styles/components/SmallAppointmentCard.scss";
import { openDrawer } from "@/components/drawerSlice";
import { useDispatch } from "react-redux";

interface Appointment {
  appointmentId: string;
  date: string;
  time: string;
  medicUser: {
    id: string;
    name: string;
  };
  patientUser?:{
    id: string;
    name: string;
  }
  initialTreatment: string;
  color: string; // Color received from the API response
}


interface SmallAppointmentCardProps {
  role: "medic" | "patient";
  appointment: Appointment; // Pass the full appointment object
}

const SmallAppointmentCard: React.FC<SmallAppointmentCardProps> = ({
  role,
  appointment,
}) => {
  const { date, time, initialTreatment, medicUser, patientUser, color } = appointment;

  const dispatch = useDispatch();


  // Format date to 'Mon, Nov 24'
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Generate initials from a string
  const generateInitial = (text: string) =>
    text
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");

  const displayName = role === "medic" ? patientUser?.name : medicUser.name;

  // Handle appointment click
  const handleAppointmentClick = () => {
    dispatch(openDrawer({ type: "Appointment", data: { appointment } }));
  };

  return (
    <div className="appointment-card" onClick={handleAppointmentClick}>
      <div className="card-header">
        <span className="date">{formatDate(date)}</span>
        <span className="time">{time}</span>
      </div>
      <hr className="divider" />
      <div className="card-body">
        <div className="color-box" style={{ backgroundColor: color }}>
          {generateInitial(initialTreatment)}
        </div>
        <div className="content">
          <div className="treatment">{initialTreatment}</div>
          <div className="display-name">{displayName}</div>
        </div>
      </div>
    </div>
  );
};

export default SmallAppointmentCard;
