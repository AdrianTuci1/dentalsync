import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./StepCalendar.module.scss";
import Calendar from "../../home/Calendar";
import { nextStep, selectDate } from "@/api/slices/requestSlice";

const StepCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: any) => state.request.selectedDate);
  const [tempSelectedDate, setTempSelectedDate] = useState<string | null>(selectedDate);

  // Funcție pentru selectarea unei zile
  const handleSelectDate = (date: string) => {
    setTempSelectedDate(date);
  };

  // Salvăm selecția și trecem la pasul următor
  const handleContinue = () => {
    if (tempSelectedDate) {
      dispatch(selectDate(tempSelectedDate));
      dispatch(nextStep());
    }
  };

  return (
    <div className={styles.container}>
      <h2>Selectează o zi</h2>
      <p>Alege o dată disponibilă pentru programare.</p>

      {/* 🗓️ Afișăm 3 luni fără navigator */}
      <Calendar />

      {/* ✅ Butonul de continuare */}
      <button
        className={styles.continueButton}
        onClick={handleContinue}
        disabled={!tempSelectedDate}
      >
        Continuă
      </button>
    </div>
  );
};

export default StepCalendar;