import React from "react";
import styles from "./Legend.module.scss";

const Legend: React.FC = () => {
  return (
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <span className={`${styles.colorBox} ${styles.busy}`}></span>
        <p>Aglomerat</p>
      </div>
      <div className={styles.legendItem}>
        <span className={`${styles.colorBox} ${styles.moderate}`}></span>
        <p>Moderat</p>
      </div>
      <div className={styles.legendItem}>
        <span className={`${styles.colorBox} ${styles.normal}`}></span>
        <p>Normal</p>
      </div>
      <div className={styles.legendItem}>
        <span className={`${styles.colorBox} ${styles.nonWorking}`}></span>
        <p>Nu lucram</p>
      </div>
    </div>
  );
};

export default Legend;