import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

interface ClinicPatientsData {
  male: number[];
  female: number[];
  days: string[];
}

interface ClinicPatientsProps {
  data: ClinicPatientsData;
}

const ClinicPatients: React.FC<ClinicPatientsProps> = ({ data }) => {
  return (
    <div style={{width:'100%', textAlign:'left'}}>
      <h3>Patients</h3>
      <div className="chart">
      <BarChart
        xAxis={[
          {
            data: data.days, // Categorical data for days of the week
            scaleType: 'band', // Use "band" scale for categorical x-axis
            label: 'Days of the Week',
          },
        ]}
        series={[
          {
            id: 'male-series',
            data: data.male,
            label: 'Male',
            color: '#3f51b5',
            stack: 'patients', // Stack group for male and female data
          },
          {
            id: 'female-series',
            data: data.female,
            label: 'Female',
            color: '#e91e63',
            stack: 'patients', // Same stack group
          },
        ]}
        width={350}
        height={300}
      />
      </div>
    </div>
  );
};

export default ClinicPatients;
