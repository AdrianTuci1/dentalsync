import React from "react";
import styles from "./Schedule.module.scss";

const scheduleData = [
  { day: "Mon-Fri", hours: "08:00 - 18:00" },
  { day: "Sat", hours: "10:00 - 14:00" },
  { day: "Sun", hours: "Closed" },
];

const Schedule: React.FC = () => {
  return (
    <div className={styles.schedule}>
      <h4>Ore de lucru</h4>
      <ul>
        {scheduleData.map((item, index) => (
          <li
            key={index}
            className={item.hours === "Closed" ? styles.closed : ""}
          >
            <span className={styles.day}>{item.day}</span>
            <span className={styles.hours}>{item.hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;