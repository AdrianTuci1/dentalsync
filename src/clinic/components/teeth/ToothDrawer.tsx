import React, { useState } from "react";
import { ToothCondition } from "./utils/toothCondition";
import "../../styles/components/TeethChart.scss";

interface ToothDrawerProps {
  selectedTooth: {
    ISO: number;
    Name: string;
  } | null;
  onClose: () => void;
  teethConditions: Record<number, keyof typeof ToothCondition>;
  setTeethConditions: React.Dispatch<
    React.SetStateAction<Record<number, keyof typeof ToothCondition>>
  >;
  toothHistory: Record<number, { description: string }[]>;
  setToothHistory: React.Dispatch<
    React.SetStateAction<Record<number, { description: string }[]>>
  >;
}

const ToothDrawer: React.FC<ToothDrawerProps> = ({
  selectedTooth,
  onClose,
  teethConditions,
  setTeethConditions,
  toothHistory,
  setToothHistory,
}) => {
  const [historyInput, setHistoryInput] = useState<string>("");

  if (!selectedTooth) return null;

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const condition = e.target.value as keyof typeof ToothCondition;
    setTeethConditions((prev) => ({
      ...prev,
      [selectedTooth.ISO]: condition,
    }));
  };

  const handleAddHistory = () => {
    if (historyInput.trim()) {
      setToothHistory((prev) => ({
        ...prev,
        [selectedTooth.ISO]: [
          ...(prev[selectedTooth.ISO] || []),
          { description: historyInput },
        ],
      }));
      setHistoryInput("");
    }
  };

  const handleRemoveHistory = (entryIndex: number) => {
    setToothHistory((prev) => ({
      ...prev,
      [selectedTooth.ISO]: prev[selectedTooth.ISO]?.filter(
        (_, index) => index !== entryIndex
      ),
    }));
  };

  return (
    <div className="drawer">
      <h4>Tooth Details</h4>
      <p>
        <strong>ISO:</strong> {selectedTooth.ISO}
      </p>
      <p>
        <strong>Name:</strong> {selectedTooth.Name}
      </p>

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

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ToothDrawer;
