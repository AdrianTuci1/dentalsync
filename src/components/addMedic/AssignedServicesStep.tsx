import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AssignedServicesStepProps {
    cosmeticServices: string[];
    treatmentServices: string[];
    selectedCosmeticServices: string[];
    selectedTreatmentServices: string[];
    onServiceChange: (serviceType: 'cosmetic' | 'treatment', service: string) => void;
}

const AssignedServicesStep: React.FC<AssignedServicesStepProps> = ({
    cosmeticServices,
    treatmentServices,
    selectedCosmeticServices,
    selectedTreatmentServices,
    onServiceChange
}) => {
    // Track expanded accordion states
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Check if a service is selected
    const isServiceSelected = (serviceType: 'cosmetic' | 'treatment', service: string) => {
        return serviceType === 'cosmetic'
            ? selectedCosmeticServices.includes(service)
            : selectedTreatmentServices.includes(service);
    };

    return (
        <Box>
            {/* Cosmetic Services Accordion */}
            <Accordion expanded={expanded === 'cosmeticPanel'} onChange={handleAccordionChange('cosmeticPanel')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                        Cosmetic services ({selectedCosmeticServices.length} Selected)
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        {cosmeticServices.map((service) => (
                            <Grid item xs={12} key={service}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isServiceSelected('cosmetic', service)}
                                            onChange={() => onServiceChange('cosmetic', service)}
                                        />
                                    }
                                    label={service}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* Treatment Services Accordion */}
            <Accordion expanded={expanded === 'treatmentPanel'} onChange={handleAccordionChange('treatmentPanel')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                        Treatment services ({selectedTreatmentServices.length} Selected)
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        {treatmentServices.map((service) => (
                            <Grid item xs={12} key={service}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isServiceSelected('treatment', service)}
                                            onChange={() => onServiceChange('treatment', service)}
                                        />
                                    }
                                    label={service}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default AssignedServicesStep;
