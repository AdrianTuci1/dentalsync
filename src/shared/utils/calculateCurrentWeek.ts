// utils/calculateCurrentWeek.ts
export const calculateCurrentWeek = (selectedDate: Date): Date[] => {
  const dayOfWeek = selectedDate.getDay();
  const startOfWeek = new Date(selectedDate);
  const mondayOffset = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // If it's Sunday (0), start from last Monday, otherwise calculate the offset
  startOfWeek.setDate(selectedDate.getDate() + mondayOffset); // Set the date to Monday of the current week
  startOfWeek.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
};

  

  // isDateInWeek.ts
export const isDateInWeek = (date: Date, week: Date[]): boolean => {
  const startOfWeek = week[0];
  const endOfWeek = week[6];

  // Check if the date falls within the start and end of the week (inclusive)
  return date >= startOfWeek && date <= endOfWeek;
};