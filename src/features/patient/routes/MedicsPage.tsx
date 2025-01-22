import React from "react";
import "../styles/pages/medicsPage.scss";
import { Divider } from "@mui/material";
import { MdMedicalServices, MdFavorite } from "react-icons/md";

const lightColors = ["#FFE5E5", "#E5F6FF", "#E5FFE5", "#FFF5E5"];
const darkColors = ["#FF6F61", "#007BFF", "#28A745", "#FFC107"];

const medicsData = [
  {
    name: "Dr. Jane Smith",
    speciality: "Orthodontist",
    photo: "/avatar1.avif",
    workingDays: ["Lu", "Ma", "Mi"],
    experience: 12,
    likes: 92,
  },
  {
    name: "Dr. John Doe",
    speciality: "Periodontist",
    photo: "/avatar2.avif",
    workingDays: ["Ma", "Mi", "Vi"],
    experience: 8,
    likes: 89,
  },
  {
    name: "Dr. Emily Johnson",
    speciality: "Cosmetic Dentist",
    photo: "/avatar3.avif",
    workingDays: ["Monday", "Thursday", "Saturday"],
    experience: 10,
    likes: 95,
  },
];

const MedicsPage: React.FC = () => {
  return (
    <div className="outer-layer">
      <div className="medics-page">
        {medicsData.map((medic, index) => (
          <MedicCard key={index} medic={medic} colorIndex={index % lightColors.length} />
        ))}
      </div>
    </div>
  );
};

const MedicCard: React.FC<{ medic: typeof medicsData[0]; colorIndex: number }> = ({ medic, colorIndex }) => {
  const daysOfWeek = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sa", "Du"];
  const lightColor = lightColors[colorIndex];
  const darkColor = darkColors[colorIndex];

  return (
    <div className="medic-card">
      <div className="medic-header">
        <img src={medic.photo} alt={medic.name} className="medic-photo" />
        <div className="medic-info">
          <h3 className="medic-name">{medic.name}</h3>
          <div className="medic-speciality-chip" style={{ backgroundColor: lightColor, color: darkColor }}>
            {medic.speciality}
          </div>
          <p className="medic-experience">
            <MdMedicalServices className="icon" /> {medic.experience} years
          </p>
          <p className="medic-likes">
            <MdFavorite className="icon" /> {medic.likes}% likes
          </p>
          <div className="working-days">
          {daysOfWeek.map((day, index) => (
            <div key={index} className={`working-day-circle ${medic.workingDays.includes(day) ? "active" : ""}`}>
              {day}
            </div>
          ))}
        </div>
        </div>
      </div>
      <Divider />
      <div className="medic-details">
        <button className="appointment-button">Make an Appointment</button>
      </div>
    </div>
  );
};

export default MedicsPage;