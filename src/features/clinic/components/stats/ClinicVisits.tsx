import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

interface ClinicVisitsData {
  male: number[];
  female: number[];
  months: string[];
}

interface ClinicVisitsProps {
  data: ClinicVisitsData;
}

const ClinicVisits: React.FC<ClinicVisitsProps> = ({ data }) => {
  return (
    <div style={{textAlign:'left', width:'100%'}}>
      <h3>Patient visit</h3>
      <LineChart
        xAxis={[
          {
            data: data.months, // Categorical data for months (e.g., Jan, Feb, etc.)
            scaleType: 'band', // Categorical scale for the x-axis
            label: 'Months',
          },
        ]}
        series={[
          {
            data: data.male, // Numeric data for male patients
            label: 'Male',
            color: '#3f51b5',
          },
          {
            data: data.female, // Numeric data for female patients
            label: 'Female',
            color: '#e91e63',
          },
        ]}
        height={300}
      />
    </div>
  );
};

export default ClinicVisits;
