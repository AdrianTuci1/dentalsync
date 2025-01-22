import React, { useEffect, useState, useCallback } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryService from '@/api/categoryService';
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

  const clinicDb = getSubdomain() + '_db'; // Replace with the actual Redux state key for the clinic DB
  const categoryService = new CategoryService(clinicDb);

  const fetchCategories = useCallback(async () => {
    try {
      // Fetch categories from the backend
      const data = await categoryService.getAllCategories();

      // Validate and transform the response to match the expected type
      if (typeof data === 'object' && data !== null) {
        setCategories(data as any);
      } else {
        console.error('Invalid API response format:', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [categoryService]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setSelectedTreatments(assignedTreatments || []);
  }, [assignedTreatments]);

  const handleCheck = (treatmentName: string) => {
    const updatedSelected = selectedTreatments.includes(treatmentName)
      ? selectedTreatments.filter((name) => name !== treatmentName)
      : [...selectedTreatments, treatmentName];

    setSelectedTreatments(updatedSelected);
    onServiceChange(updatedSelected);
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