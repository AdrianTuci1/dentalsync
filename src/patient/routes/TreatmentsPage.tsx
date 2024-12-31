import React, { useEffect, useState } from 'react';
import '../styles/pages/treatments.scss';
import { Chip } from '@mui/material';

// Mock API data for treatments
const treatmentsData = [
  {
    category: 'Preventive Care',
    treatments: [
      { name: 'Teeth Cleaning', price: '$50' },
      { name: 'Fluoride Treatment', price: '$30' },
    ],
  },
  {
    category: 'Restorative Care',
    treatments: [
      { name: 'Fillings', price: '$80' },
      { name: 'Crowns', price: '$500' },
    ],
  },
  {
    category: 'Cosmetic Care',
    treatments: [
      { name: 'Whitening', price: '$200' },
      { name: 'Veneers', price: '$700' },
    ],
  },
  {
    category: 'Orthodontics',
    treatments: [
      { name: 'Braces', price: '$3000' },
      { name: 'Retainers', price: '$400' },
    ],
  },
];

const TreatmentsPage: React.FC = () => {
  const [categories, setCategories] = useState<typeof treatmentsData>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data from API
    setCategories(treatmentsData);
    setActiveCategory(treatmentsData[0]?.category || null);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    const targetElement = document.getElementById(category);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="treatments-page">
      <div className="navigation-menu">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`nav-item ${activeCategory === category.category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.category)}
          >
            {category.category}
          </div>
        ))}
      </div>

      <div className="categories-chips">
        {categories.map((category, index) => (
          <Chip
            key={index}
            label={category.category}
            onClick={() => handleCategoryClick(category.category)}
            className={`chip ${activeCategory === category.category ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="categories-list">
        {categories.map((category, index) => (
          <div key={index} id={category.category} className="category-box">
            <h2 className="category-name">{category.category}</h2>
            <div className="treatments-list">
              {category.treatments.map((treatment, i) => (
                <div key={i} className="treatment-item">
                  <span className="treatment-name">{treatment.name}</span>
                  <span className="treatment-price">{treatment.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentsPage;