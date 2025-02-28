export const transformDetailedToWeekly = (detailedAppointment: any) => {
    return {
      appointmentId: detailedAppointment.appointmentId,
      date: detailedAppointment.date,
      startHour: detailedAppointment.time,  // Ensure correct format
      endHour: "", // We don't have treatment duration
      initialTreatment: detailedAppointment.initialTreatment,
      medicId: detailedAppointment.medicId,
      medicUser: detailedAppointment.medicUser,
      patientId: detailedAppointment.patientId,
      patientUser: detailedAppointment.patientUser,
      color: detailedAppointment.treatments?.[0]?.color || "#FF5733",
      status: determineStatus(detailedAppointment), // ✅ Ensure correct appointment status
    };
  };
  
  // 🔹 Utility function to determine appointment status
  export const determineStatus = (appointment: any) => {
    const today = new Date().toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)
    
    const isPastDate = appointment.date < today;
    const isUpcoming = appointment.date >= today;
  
    if (isPastDate) {
      if (!appointment.isDone && !appointment.isPaid) return "missed";  // ❌ Missed: Not done, not paid
      if (appointment.isPaid) return "missed";  // ❌ Missed: Paid but not done
      if (appointment.isDone && !appointment.isPaid) return "notpaid"; // ❌ Not Paid: Done but not paid
    }
  
    if (isUpcoming) {
      if (!appointment.isDone && !appointment.isPaid) return "upcoming"; // 📅 Upcoming: Default state
      if (appointment.isPaid) return "upcoming";  // 📅 Upcoming: Paid but not done
      if (appointment.isDone && !appointment.isPaid) return "notpaid"; // ❌ Not Paid: Done but not paid
    }
  
    return "upcoming"; // Default fallback
  };