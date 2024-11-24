import React from "react";
import "../styles/components/SmallAppointmentCard.scss";

interface AppointmentData {
  date: string;
  time: string;
  initialTreatment: string;
  medicUser: string;
  patientUser: string;
  color: string;
}

interface SmallAppointmentCardProps {
  role: "medic" | "patient";
  data: AppointmentData;
}

const SmallAppointmentCard: React.FC<SmallAppointmentCardProps> = ({
  role,
  data,
}) => {
  const { date, time, initialTreatment, medicUser, patientUser, color } = data;

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

  const displayName = role === "medic" ? patientUser : medicUser;

  return (
    <div className="appointment-card">
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
