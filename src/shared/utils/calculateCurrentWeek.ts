import { startOfWeek, addDays } from 'date-fns';


export const calculateCurrentWeek = (selectedDate: Date): Date[] => {
  // Normalize the selected date to avoid time issues
  const normalizedDate = new Date(selectedDate);
  normalizedDate.setHours(0, 0, 0, 0);


  // Get the Monday of the current week
  const monday = startOfWeek(normalizedDate, { weekStartsOn: 1 }); // Week starts on Monday

  // Generate the full week starting from Monday
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  return week;
};

  // isDateInWeek.ts
export const isDateInWeek = (date: Date, week: Date[]): boolean => {
  const startOfWeek = week[0];
  const endOfWeek = week[6];

  // Check if the date falls within the start and end of the week (inclusive)
  return date >= startOfWeek && date <= endOfWeek;
};