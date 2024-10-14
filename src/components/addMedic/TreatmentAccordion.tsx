import React, { useEffect, useState, useCallback } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreatmentService from '../../services/treatmentService';
import { Treatment } from '../../types/treatmentType';
import { useSelector } from 'react-redux';

export interface Category {
    id: string;
    name: string;
    treatments: Treatment[];
}

interface TreatmentAccordionProps {
    assignedTreatments: string[];
    onServiceChange: (updatedServices: string[]) => void;
}

const TreatmentAccordion: React.FC<TreatmentAccordionProps> = ({ assignedTreatments, onServiceChange }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedTreatments, setSelectedTreatments] = useState<string[]>(assignedTreatments || []);

    const token = useSelector((state: any) => state.auth.subaccountToken);
    const treatmentService = new TreatmentService(token, 'demo_db');

    const fetchData = useCallback(async () => {
      try {
        let data: Category[] = await treatmentService.getTreatmentsByCategory();
    
        // Separate treatments without a category
        const noCategoryTreatments: Treatment[] = [];
        data = data.map((category) => {
          const treatmentsWithCategory = category.treatments.filter((treatment) => {
            if (!treatment.category) {
              noCategoryTreatments.push(treatment);
              return false;
            }
            return true;
          });
          return { ...category, treatments: treatmentsWithCategory };
        });
    
        if (noCategoryTreatments.length > 0) {
          data.push({
            id: 'no_category',
            name: 'No Category',
            treatments: noCategoryTreatments,
          });
        }
    
        setCategories(data);
      } catch (error) {
        console.error('Error fetching treatments by category:', error);
      }
    }, [treatmentService]);
    

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
            {categories.map((category) => (
                <Accordion key={category.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {category.name}
                    </AccordionSummary>
                    <AccordionDetails>
                        {category.treatments.map((treatment) => (
                            <FormControlLabel
                                key={treatment.id}
                                control={
                                    <Checkbox
                                        checked={selectedTreatments.includes(treatment.name)}
                                        onChange={() => handleCheck(treatment.name)}
                                    />
                                }
                                label={treatment.name}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default TreatmentAccordion;
