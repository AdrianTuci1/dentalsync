import React, { useEffect, useState } from "react";
import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import { MedicInfo } from "@/features/clinic/types/Medic";

interface WorkingHoursStepProps {
  workingDaysHours: MedicInfo["medicProfile"]["workingDaysHours"];
  onWorkingHoursChange: (updatedHours: MedicInfo["medicProfile"]["workingDaysHours"]) => void;
}

// ✅ Mapping abbreviations to full day names
const DAY_MAP: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const WorkingHoursStep: React.FC<WorkingHoursStepProps> = ({ workingDaysHours, onWorkingHoursChange }) => {
  // ✅ Local state to ensure real-time updates
  const [localWorkingHours, setLocalWorkingHours] = useState<MedicInfo["medicProfile"]["workingDaysHours"]>([]);

  // ✅ Ensure component syncs with API data when it changes
  useEffect(() => {
    console.log("🔄 Received workingDaysHours from API:", workingDaysHours);
    setLocalWorkingHours(workingDaysHours?.length > 0 ? [...workingDaysHours] : []);
  }, [workingDaysHours]);

  // ✅ Find existing working hours for a given day
  const findWorkingHours = (dayKey: string) => localWorkingHours.find((entry) => entry.day === dayKey) || null;

  const handleToggleDay = (dayKey: string) => {
    const existingEntry = findWorkingHours(dayKey);
    let updatedHours;

    if (existingEntry) {
      // ✅ Remove working hours when disabled
      updatedHours = localWorkingHours.filter((entry) => entry.day !== dayKey);
    } else {
      // ✅ Add new default working hours when enabled
      const newEntry = {
        id: Date.now(), // ✅ Temporary unique ID
        medicId: 0, // ✅ Updated when saved to backend
        day: dayKey,
        startTime: "09:00",
        endTime: "17:00",
      };
      updatedHours = [...localWorkingHours, newEntry];
    }

    setLocalWorkingHours(updatedHours);
    onWorkingHoursChange(updatedHours);
    console.log("✅ Updated workingDaysHours:", updatedHours);
  };

  const handleTimeChange = (dayKey: string, type: "startTime" | "endTime", timeValue: string) => {
    const updatedHours = localWorkingHours.map((entry) =>
      entry.day === dayKey ? { ...entry, [type]: timeValue } : entry
    );

    setLocalWorkingHours(updatedHours);
    onWorkingHoursChange(updatedHours);
    console.log(`⏰ Updated ${type} for ${dayKey}:`, timeValue);
  };

  return (
    <Box>
      {Object.entries(DAY_MAP).map(([abbr, fullName]) => {
        const workingEntry = findWorkingHours(abbr);
        const isEnabled = !!workingEntry;

        return (
          <Box key={abbr} sx={{ mb: 2 }}>
            {/* ✅ Day Toggle */}
            <FormControlLabel
              control={<Switch checked={isEnabled} onChange={() => handleToggleDay(abbr)} size="small" />}
              label={fullName}
            />
            
            {/* ✅ Time Inputs (Only if enabled) */}
            {isEnabled && workingEntry && (
              <Box display="flex" alignItems="center" ml={4} mt={1}>
                <label style={{ marginRight: "8px" }}>
                  Start Time:
                  <input
                    type="time"
                    value={workingEntry.startTime}
                    onChange={(e) => handleTimeChange(abbr, "startTime", e.target.value)}
                    style={{
                      marginLeft: "8px",
                      marginRight: "16px",
                      padding: "4px",
                      width: "100px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </label>
                <label>
                  End Time:
                  <input
                    type="time"
                    value={workingEntry.endTime}
                    onChange={(e) => handleTimeChange(abbr, "endTime", e.target.value)}
                    style={{
                      marginLeft: "8px",
                      padding: "4px",
                      width: "100px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </label>
              </Box>
            )}
            {!isEnabled && (
              <Typography variant="body2" color="textSecondary" ml={4}>
                Not working on this day
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default WorkingHoursStep;