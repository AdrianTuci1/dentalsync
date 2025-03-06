import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./StepTimeSlots.module.css";
import { nextStep, selectTimeSlot } from "@/api/slices/requestSlice";

const StepTimeSlots: React.FC = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: any) => state.request.selectedDate);
  const selectedTimeSlot = useSelector((state: any) => state.request.selectedTimeSlot);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate) return;

    // 🔹 Simulăm intervalele orare disponibile
    const generateTimeSlots = () => {
      const allSlots = [
        "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00",
        "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "12:30 - 13:00",
        "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00",
        "16:00 - 16:30", "16:30 - 17:00"
      ];

      // Simulăm că unele intervale sunt deja ocupate
      const availableSlots = allSlots.filter(() => Math.random() > 0.1); // 70% șanse să fie liber

      setTimeSlots(availableSlots);
    };

    generateTimeSlots();
  }, [selectedDate]);

  // Salvăm selecția și trecem la pasul următor
  const handleSelectSlot = (slot: string) => {
    dispatch(selectTimeSlot(slot));
    dispatch(nextStep());
  };

  return (
    <div className={styles.container}>
      <h2>Selectează un interval orar</h2>
      <p>Data aleasă: <strong>{selectedDate}</strong></p>

      {timeSlots.length > 0 ? (
        <div className={styles.slotGrid}>
          {timeSlots.map((slot, index) => (
            <button
              key={index}
              className={`${styles.slot} ${selectedTimeSlot === slot ? styles.selected : ""}`}
              onClick={() => handleSelectSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      ) : (
        <p className={styles.noSlots}>Nu există intervale disponibile pentru această zi.</p>
      )}
    </div>
  );
};

export default StepTimeSlots;