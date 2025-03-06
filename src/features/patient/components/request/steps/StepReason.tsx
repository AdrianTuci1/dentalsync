import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./StepReason.module.css";
import { closeRequestAppointment, selectReason } from "@/api/slices/requestSlice";

const StepReason: React.FC = () => {
  const dispatch = useDispatch();
  const selectedReason = useSelector((state: any) => state.request.selectedReason);
  const [customReason, setCustomReason] = useState("");

  // Lista de motive predefinite
  const predefinedReasons = [
    "Consultație",
    "Detartraj",
    "Albire dentară",
    "Durere dentară",
    "Control periodic",
    "Tratamente ortodontice",
  ];

  // Gestionăm selecția unui motiv
  const handleSelectReason = (reason: string) => {
    dispatch(selectReason(reason));
  };

  // Gestionăm introducerea unui motiv personalizat
  const handleCustomReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomReason(e.target.value);
    dispatch(selectReason(e.target.value));
  };

  // Finalizăm programarea
  const handleFinish = () => {
    if (selectedReason) {
      console.log("Rezervare finalizată:", selectedReason);
      dispatch(closeRequestAppointment());
    }
  };

  return (
    <div className={styles.container}>
      <h2>Selectează motivul programării</h2>
      <p>Alege un motiv din listă sau introduce unul personalizat.</p>

      {/* 🦷 Motive predefinite */}
      <div className={styles.reasonList}>
        {predefinedReasons.map((reason, index) => (
          <button
            key={index}
            className={`${styles.reason} ${selectedReason === reason ? styles.selected : ""}`}
            onClick={() => handleSelectReason(reason)}
          >
            {reason}
          </button>
        ))}
      </div>

      {/* ✍️ Motiv personalizat */}
      <textarea
        placeholder="Introduceți un motiv (opțional)"
        value={customReason}
        onChange={handleCustomReasonChange}
      />

      {/* ✅ Buton de finalizare */}
      <button className={styles.finishButton} onClick={handleFinish} disabled={!selectedReason}>
        Finalizează programarea
      </button>
    </div>
  );
};

export default StepReason;