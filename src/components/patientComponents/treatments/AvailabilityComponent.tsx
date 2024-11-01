import React, {useState} from 'react';
import '../../../styles/patientDashboard/availabilityComponent.scss';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isSameMonth } from 'date-fns';

interface AvailabilityCalendarProps {
  busyDates: Date[]; // Dates that are busy or booked
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ busyDates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>
            &#8249;
          </div>
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
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isBusy = busyDates.some((busyDate) => isSameDay(busyDate, day));

        days.push(
          <div
            className={`col cell ${!isSameMonth(day, monthStart) ? 'disabled' : isBusy ? 'busy' : ''}`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
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
