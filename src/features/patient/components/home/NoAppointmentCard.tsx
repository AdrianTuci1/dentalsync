import React from "react";
import { useNavigate } from "react-router-dom";
import { HiPlus } from "react-icons/hi";
import styles from "./NoAppointmentCard.module.scss";

const NoAppointmentCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate("/request-appointment")}>
      <div className={styles.cardContent}>
        <HiPlus className={styles.plusIcon} />
        <span className={styles.text}>Cere o programare</span>
      </div>
    </div>
  );
};

export default NoAppointmentCard;