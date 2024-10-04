export const calculateCurrentWeek = (selectedDate: Date): Date[] => {
    const dayOfWeek = selectedDate.getDay(); // 0 (Sun) to 6 (Sat)
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
  
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };
  