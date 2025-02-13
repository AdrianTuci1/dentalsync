import React, { useState, useEffect } from "react";
import styles from "./Calendar.module.scss";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Define types for days
interface DayStatus {
  date: string;
  status: "busy" | "moderate" | "normal" | "non-working";
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<DayStatus[]>([]);

  useEffect(() => {
    // Simulated API response
    const fetchDummyData = () => {
      const dummyDays: DayStatus[] = [];
      const totalDays = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      ).getDate();

      for (let i = 1; i <= totalDays; i++) {
        const randomStatus = ["busy", "moderate", "normal", "non-working"][
          Math.floor(Math.random() * 4)
        ] as DayStatus["status"];

        dummyDays.push({
          date: `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-${i}`,
          status: randomStatus,
        });
      }
      setDays(dummyDays);
    };

    fetchDummyData();
  }, [currentMonth]);

  // Get today's date
  const today = new Date();
  const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  // Get the first day of the month (0 = Sunday, 1 = Monday, ...)
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  // Adjust to make Monday the first day (in JavaScript, Sunday is 0)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "busy":
        return styles.busy;
      case "moderate":
        return styles.moderate;
      case "normal":
        return styles.normal;
      case "non-working":
        return styles.nonWorking;
      default:
        return "";
    }
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  return (
    <div className={styles.calendar}>
      {/* 🏷️ Day Initials */}
      <div className={styles.weekDays}>
        {weekDays.map((day, index) => (
          <div key={index} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {/* Empty boxes for compensation */}
        {Array.from({ length: adjustedFirstDay }).map((_, index) => (
          <div key={`empty-${index}`} className={styles.emptyDay}></div>
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const dayNumber = index + 1;
          const dayData = days.find(
            (day) => new Date(day.date).getDate() === dayNumber
          );
          const isToday = dayData?.date === todayString;

          return (
            <div
              key={index}
              className={`${styles.day} ${dayData ? getStatusColor(dayData.status) : ""} ${
                isToday ? styles.today : ""
              }`}
            >
              <div className={styles.dayNumber}>{dayNumber}</div>
            </div>
          );
        })}
      </div>

      {/* 📅 Month Navigator */}
      <div className={styles.footer}>
        <button onClick={prevMonth}>
          <FaArrowLeft />
        </button>
        <button onClick={nextMonth}>
          <FaArrowRight />
        </button>
        <h3>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h3>
      </div>
    </div>
  );
};

export default Calendar;