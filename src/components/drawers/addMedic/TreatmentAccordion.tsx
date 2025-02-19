import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryService from '@/api/services/categoryService';
import { getSubdomain } from '@/shared/utils/getSubdomains';

interface Treatment {
  id: string;
  name: string;
  category: string | null;
  price: number;
}

interface TreatmentAccordionProps {
  assignedTreatments: string[];
  onServiceChange: (updatedServices: string[]) => void;
}

const TreatmentAccordion: React.FC<TreatmentAccordionProps> = ({
  assignedTreatments,
  onServiceChange,
}) => {
  const [categories, setCategories] = useState<Record<string, Treatment[]>>({});
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>(assignedTreatments || []);

  // Persistent instance of CategoryService
  const categoryServiceRef = useRef<CategoryService | null>(null);

  useEffect(() => {
    categoryServiceRef.current = new CategoryService(`${getSubdomain()}_db`);
  }, []);

  const fetchCategories = useCallback(async () => {
    if (!categoryServiceRef.current) return;

    try {
      const data = await categoryServiceRef.current.getAllCategories();

      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setCategories(data as Record<string, Treatment[]>);
      } else {
        console.error('Invalid API response format:', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setSelectedTreatments(assignedTreatments || []);
  }, [assignedTreatments]);

  const handleCheck = (treatmentId: string) => {
    setSelectedTreatments((prevSelected) => {
      const updatedSelected = prevSelected.includes(treatmentId)
        ? prevSelected.filter((id) => id !== treatmentId)
        : [...prevSelected, treatmentId];

      onServiceChange(updatedSelected);
      return updatedSelected;
    });
  };

  return (
    <div>
      {Object.entries(categories).map(([categoryName, treatments]) => (
        <Accordion key={categoryName}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {categoryName}
          </AccordionSummary>
          <AccordionDetails>
            {treatments.map((treatment) => (
              <FormControlLabel
                key={treatment.id}
                control={
                  <Checkbox
                    checked={selectedTreatments.includes(treatment.id)}
                    onChange={() => handleCheck(treatment.id)}
                  />
                }
                label={`${treatment.name} - $${treatment.price}`}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default TreatmentAccordion;