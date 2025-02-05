import { MedicInfo, MedicsListItem } from "@/features/clinic/types/Medic";

export const transformMedicInfoToTableFormat = (medicInfo: MedicInfo): MedicsListItem => {
    // Mapping full day names to their abbreviations
    const dayAbbreviations: Record<string, string> = {
      Monday: "M",
      Tuesday: "T",
      Wednesday: "W",
      Thursday: "T",
      Friday: "F",
      Saturday: "S",
      Sunday: "S",
    };
  
    // Ensure the order is correct for the table
    const weekDaysOrder = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];
  
    // Convert workingHours object into an ordered array of abbreviations
    const transformedWorkingDays = weekDaysOrder
      .map((day) => (medicInfo.workingHours?.[day] ? dayAbbreviations[day] : ""))
      .filter(Boolean); // Remove empty strings to keep only active working days
  
    return {
      id: medicInfo.id ?? "", // Ensure a valid string
      name: medicInfo.info?.name || "Unknown",
      specialty: medicInfo.info?.specialization || "Unknown",
      contact: medicInfo.info?.phone || "No contact",
      email: medicInfo.info?.email || "No email",
      workingDays: transformedWorkingDays, // Transformed array of working days
      employmentType: medicInfo.info?.employmentType === "full-time" ? "FULL-TIME" : "PART-TIME",
    };
  };
  