import React, { useState } from "react";
import { Box, Switch, FormControlLabel } from "@mui/material";
import TeethChart from "../../teeth/TeethChart";
import { MouthViewPermanent } from "../../teeth/MouthViewPermanent";
import { MouthViewDeciduous } from "../../teeth/MouthViewDecidous";
import ToothDrawer from "../../teeth/ToothDrawer";
import Accordion from "../../teeth/Accordion";
import { Tooth } from "../../teeth/Tooth"; // Import the Tooth class
import { ToothCondition } from "../../teeth/utils/toothCondition";

const DentalHistoryTab: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [teethConditions, setTeethConditions] = useState<
    Record<number, keyof typeof ToothCondition>
  >({});
  const [toothHistory, setToothHistory] = useState<
    Record<number, { description: string }[]>
  >({});
  const [selectedTooth, setSelectedTooth] = useState<Tooth | null>(null);
  const [showCharts, setShowCharts] = useState<boolean>(true);

  // Modify createTeeth to return a Record<number, Tooth>
  const createTeeth = (startISO: number, endISO: number): Record<number, Tooth> => {
    const teeth: Record<number, Tooth> = {};
    for (let ISO = startISO; ISO <= endISO; ISO++) {
      const tooth = new Tooth(patientId).fromISO(ISO);
      if (tooth.Name) {
        const condition = teethConditions[ISO] || "sound";
        tooth.setCondition(condition);
        teeth[ISO] = tooth;
      }
    }
    return teeth;
  };

  // Generate teeth as a Record<number, Tooth>
  const permanentTeeth = createTeeth(11, 48); // Permanent teeth (ISO 11-48)
  const deciduousTeeth = createTeeth(51, 85); // Deciduous teeth (ISO 51-85)

  const handleSelectTooth = (ISO: number) => {
    const selected = permanentTeeth[ISO] || deciduousTeeth[ISO] || null;
    setSelectedTooth(selected);
  };

  const handleCloseDrawer = () => {
    setSelectedTooth(null);
  };


  return (
    <Box sx={{ p: 1 }}>
      {/* Toggle Switch */}
      <FormControlLabel
        control={
          <Switch
            checked={showCharts}
            onChange={(e) => setShowCharts(e.target.checked)}
          />
        }
        label={showCharts ? "Show Teeth Charts" : "Show Mouth Views"}
      />

      {showCharts ? (
        <>
          {/* Teeth Charts */}
          <Accordion title="Permanent Teeth Chart">
            <TeethChart
              teethType="permanent"
              onSelectTooth={handleSelectTooth}
              teethConditions={teethConditions}
            />
          </Accordion>
          <Accordion title="Deciduous Teeth Chart">
            <TeethChart
              teethType="deciduous"
              onSelectTooth={handleSelectTooth}
              teethConditions={teethConditions}
            />
          </Accordion>
        </>
      ) : (
        <>
          {/* Mouth Views */}
          <Accordion title="Permanent Teeth Mouth View">
            <MouthViewPermanent teeth={permanentTeeth} onClick={handleSelectTooth} />
          </Accordion>
          <Accordion title="Deciduous Teeth Mouth View">
            <MouthViewDeciduous teeth={deciduousTeeth} onClick={handleSelectTooth} />
          </Accordion>
        </>
      )}

      {/* Tooth Drawer */}
      <ToothDrawer
        selectedTooth={selectedTooth}
        onClose={handleCloseDrawer}
        teethConditions={teethConditions}
        setTeethConditions={setTeethConditions}
        toothHistory={toothHistory}
        setToothHistory={setToothHistory}
      />
    </Box>
  );
};

export default DentalHistoryTab;
