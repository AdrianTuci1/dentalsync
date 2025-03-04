import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CategoryService from "@/api/services/categoryService";
import { getSubdomain } from "@/shared/utils/getSubdomains";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"; // ✅ Indicator Icon

interface Treatment {
  id: string;
  name: string;
  category: string | null;
  price: number;
}

interface HighlightedItem {
  id: string;
  name: string;
  type: "category" | "treatment";
}

const CategoryTreatmentManager: React.FC = () => {
  const [categories, setCategories] = useState<Record<string, Treatment[]>>({});
  const [highlightedItems, setHighlightedItems] = useState<HighlightedItem[]>([]);

  const categoryServiceRef = useRef<CategoryService | null>(null);

  useEffect(() => {
    categoryServiceRef.current = new CategoryService(`${getSubdomain()}_db`);
  }, []);

  const fetchCategories = useCallback(async () => {
    if (!categoryServiceRef.current) return;

    try {
      const data = await categoryServiceRef.current.getAllCategories();
      if (data && typeof data === "object" && !Array.isArray(data)) {
        setCategories(data as Record<string, Treatment[]>);
      } else {
        console.error("Invalid API response format:", data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ✅ Handle Highlights (Categories or Treatments)
  const toggleHighlight = (id: string, name: string, type: "category" | "treatment") => {
    setHighlightedItems((prev) => {
      if (prev.some((item) => item.id === id)) {
        return prev.filter((item) => item.id !== id);
      } else if (prev.length < 4) {
        return [...prev, { id, name, type }];
      }
      return prev; // Ignore if max highlights reached
    });
  };

  // ✅ Remove a highlight from the top list
  const removeHighlight = (id: string) => {
    setHighlightedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Box>
      {/* Display Highlighted Items */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Highlighted Items (Max: 4)
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {highlightedItems.length > 0 ? (
          highlightedItems.map((item) => (
            <Chip
              key={item.id}
              label={`${item.type === "category" ? "Category" : "Treatment"}: ${item.name}`}
              onDelete={() => removeHighlight(item.id)}
              color="primary"
              sx={{ fontSize: "0.85rem", p: "5px", }}
            />
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No highlights selected.
          </Typography>
        )}
      </Box>

      {/* Display Categories and Treatments */}
      {Object.entries(categories).map(([categoryName, treatments]) => {
        // ✅ Check if any treatment inside is highlighted
        const hasHighlightedTreatment = treatments.some((treatment) =>
          highlightedItems.some((item) => item.id === treatment.id && item.type === "treatment")
        );


        return (
          <Accordion key={categoryName} >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" alignItems="center" gap={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={highlightedItems.some(
                        (item) => item.id === categoryName && item.type === "category"
                      )}
                      onChange={() => toggleHighlight(categoryName, categoryName, "category")}
                    />
                  }
                  label={`Category: ${categoryName}`}
                />
                {hasHighlightedTreatment && (
                  <FiberManualRecordIcon sx={{ fontSize: 10, color: "blue" }} /> // ✅ Small blue indicator
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {treatments.map((treatment) => (
                <FormControlLabel
                  key={treatment.id}
                  control={
                    <Checkbox
                      checked={highlightedItems.some(
                        (item) => item.id === treatment.id && item.type === "treatment"
                      )}
                      onChange={() => toggleHighlight(treatment.id, treatment.name, "treatment")}
                    />
                  }
                  label={`${treatment.name} - $${treatment.price}`}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default CategoryTreatmentManager;