import React, { useState } from 'react';
import '../../styles/availabilityComponent.scss';
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
} from 'date-fns';

interface AvailabilityCalendarProps {
  busyDates: Date[];
  moderateDates: Date[];
  normalDates: Date[];
  nonWorkingDays: Date[];
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  busyDates,
  moderateDates,
  normalDates,
  nonWorkingDays,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="header row flex-middle">
        <div className="col col-start" onClick={prevMonth}>
          <div className="icon">&#8249;</div>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">&#8250;</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(date, i), 'EEEEEE')}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;

        // Determine availability status for each day
        const isBusy = busyDates.some((busyDate) => isSameDay(busyDate, day));
        const isModerate = moderateDates.some((moderateDate) => isSameDay(moderateDate, day));
        const isNormal = normalDates.some((normalDate) => isSameDay(normalDate, day));
        const isNonWorking = nonWorkingDays.some((nonWorkingDate) => isSameDay(nonWorkingDate, day));

        let statusClass = '';
        if (isBusy) statusClass = 'busy';
        else if (isModerate) statusClass = 'moderate';
        else if (isNormal) statusClass = 'normal';
        else if (isNonWorking) statusClass = 'non-working';

        days.push(
          <div
            className={`col cell ${!isSameMonth(day, monthStart) ? 'disabled' : statusClass}`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
            <span className={`status-circle ${statusClass}`}></span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const onDateClick = (day: Date) => {
    console.log('Selected Date:', day);
  };

  const nextMonth = () => {
    setCurrentMonth(addDays(currentMonth, 30));
  };

  const prevMonth = () => {
    setCurrentMonth(addDays(currentMonth, -30));
  };

  return (
      <div className="availability-calendar">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
  );
};

export default AvailabilityCalendar;
