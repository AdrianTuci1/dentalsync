import { useState } from "react";
import { convert } from "./utils/teeth-numbering-system"; // Import the convert function
import { ToothCondition, conditionToColor } from "./utils/toothCondition"; // Import ToothCondition and conditionToColor
import "../../styles/components/TeethChart.scss"; // Import CSS for styling


interface TeethChartProps {
  teethType: "permanent" | "deciduous";
}

const TeethChart: React.FC<TeethChartProps> = ({ teethType }) => {
  const [teethConditions, setTeethConditions] = useState<Record<number, keyof typeof ToothCondition>>({});
  const [toothHistory, setToothHistory] = useState<Record<number, { description: string }[]>>({});
  const [selectedTooth, setSelectedTooth] = useState<ReturnType<typeof convert> | null>(null);
  const [historyInput, setHistoryInput] = useState<string>("");

  // Define teeth rows based on props
  const rows =
    teethType === "permanent"
      ? {
          upperRow: [...Array(16)].map((_, i) => 18 - i),
          lowerRow: [...Array(16)].map((_, i) => 48 - i),
        }
      : {
          upperRow: [...Array(10)].map((_, i) => 55 - i),
          lowerRow: [...Array(10)].map((_, i) => 85 - i),
        };

  // Handle tooth selection
  const handleSelectTooth = (ISO: number) => {
    setSelectedTooth(convert(ISO));
  };

  // Update tooth condition
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const condition = e.target.value as keyof typeof ToothCondition;
    if (selectedTooth) {
      setTeethConditions((prev) => ({
        ...prev,
        [selectedTooth.ISO]: condition,
      }));
    }
  };

  // Add a new history entry
  const handleAddHistory = () => {
    if (selectedTooth && historyInput.trim()) {
      setToothHistory((prev) => ({
        ...prev,
        [selectedTooth.ISO]: [
          ...(prev[selectedTooth.ISO] || []),
          { description: historyInput },
        ],
      }));
      setHistoryInput(""); // Clear input
    }
  };

  // Remove a specific history entry
  const handleRemoveHistory = (entryIndex: number) => {
    if (selectedTooth) {
      setToothHistory((prev) => ({
        ...prev,
        [selectedTooth.ISO]: prev[selectedTooth.ISO]?.filter((_, index) => index !== entryIndex),
      }));
    }
  };

  return (
    <div className="teeth-chart">
      {/* Upper Row */}
      <div className="teeth-row">
        {rows.upperRow.map((ISO) => {
          const condition = teethConditions[ISO] || "sound";
          const color = conditionToColor(condition);

          return (
            <button
              key={ISO}
              className="tooth"
              style={{ backgroundColor: color }}
              onClick={() => handleSelectTooth(ISO)}
            >
              {ISO}
            </button>
          );
        })}
      </div>

      {/* Vertical Separator */}
      <div className="separator"></div>

      {/* Lower Row */}
      <div className="teeth-row">
        {rows.lowerRow.map((ISO) => {
          const condition = teethConditions[ISO] || "sound";
          const color = conditionToColor(condition);

          return (
            <button
              key={ISO}
              className="tooth"
              style={{ backgroundColor: color }}
              onClick={() => handleSelectTooth(ISO)}
            >
              {ISO}
            </button>
          );
        })}
      </div>

      {/* Drawer for Tooth Details */}
      {selectedTooth && (
        <div className="drawer">
          <h4>Tooth Details</h4>
          <p><strong>ISO:</strong> {selectedTooth.ISO}</p>
          <p><strong>Name:</strong> {selectedTooth.Name}</p>

          <label htmlFor="condition">Select Condition:</label>
          <select
            id="condition"
            onChange={handleConditionChange}
            defaultValue={teethConditions[selectedTooth.ISO] || ""}
          >
            <option value="">Select</option>
            {Object.keys(ToothCondition).map((key) => (
              <option key={key} value={key}>
                {ToothCondition[key as keyof typeof ToothCondition]}
              </option>
            ))}
          </select>

          <div className="history-section">
            <h4>Tooth History</h4>
            <ul>
              {(toothHistory[selectedTooth.ISO] || []).map((entry, index) => (
                <li key={index} className="history-item">
                  <p>{entry.description}</p>
                  <button
                    className="remove-history"
                    onClick={() => handleRemoveHistory(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="history-input">
              <input
                type="text"
                value={historyInput}
                onChange={(e) => setHistoryInput(e.target.value)}
                placeholder="Add history entry..."
              />
              <button onClick={handleAddHistory}>Add</button>
            </div>
          </div>

          <button onClick={() => setSelectedTooth(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default TeethChart;
