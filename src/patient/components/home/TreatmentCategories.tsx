import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../../styles/treatmentCategories.scss'

const categories = [
  { name: 'Preventive Care', color: '#FFEBE0' }, // Light peach
  { name: 'Restorative Care', color: '#E0F7FA' }, // Light cyan
  { name: 'Cosmetic Care', color: '#E8F5E9' }, // Light green
  { name: 'Orthodontics', color: '#FFF3E0' }, // Light orange
  { name: 'Category5', color: '#E0F7FA' }, // Light cyan
  { name: 'Category6', color: '#FFF3E0' }, // Light orange
  
];

const TreatmentCategories: React.FC = () => {
  return (
    <div className="treatment-categories">
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-box"
            style={{ backgroundColor: category.color }}
          >
            <p className="category-name">{category.name}</p>
            <ArrowForwardIosIcon className="arrow-icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentCategories;