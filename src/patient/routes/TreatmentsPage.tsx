import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/pages/treatments.scss';
import { Chip } from '@mui/material';

const treatmentsData = [
  {
    category: 'Preventive Care',
    slug: 'preventive-care',
    treatments: [
      { name: 'Teeth Cleaning', price: '$50' },
      { name: 'Fluoride Treatment', price: '$30' },
    ],
  },
  {
    category: 'Restorative Care',
    slug: 'restorative-care',
    treatments: [
      { name: 'Fillings', price: '$80' },
      { name: 'Crowns', price: '$500' },
    ],
  },
  {
    category: 'Cosmetic Care',
    slug: 'cosmetic-care',
    treatments: [
      { name: 'Whitening', price: '$200' },
      { name: 'Veneers', price: '$700' },
    ],
  },
  {
    category: 'Orthodontics',
    slug: 'orthodontics',
    treatments: [
      { name: 'Braces', price: '$3000' },
      { name: 'Retainers', price: '$400' },
    ],
  },
];

const TreatmentsPage: React.FC = () => {
  const { state } = useLocation();
  const [categories, setCategories] = useState<typeof treatmentsData>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Scroll to a specific category and adjust for sticky elements
  const scrollToCategory = (category: string) => {
    const targetElement = document.getElementById(category);
    if (targetElement) {
      const yOffset = -100; // Adjust for sticky headers
      const yPosition = targetElement.getBoundingClientRect().top + window.scrollY + yOffset;

      // Scroll to the calculated position
      window.scrollTo({ top: yPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setCategories(treatmentsData);

    // Add dynamic padding to ensure the last category can scroll to the top
    const lastCategoryHeight = document.getElementById(
      treatmentsData[treatmentsData.length - 1].category
    )?.offsetHeight || 0;

    const viewportHeight = window.innerHeight;
    const additionalPadding = Math.max(0, viewportHeight - lastCategoryHeight - 100);

    document.documentElement.style.setProperty('--dynamic-padding', `${additionalPadding}px`);

    // Handle navigation state for initial scroll
    if (state?.selectedCategory) {
      const selectedCategory = state.selectedCategory;
      setActiveCategory(selectedCategory);

      // Delay to ensure DOM is rendered before scrolling
      setTimeout(() => {
        scrollToCategory(selectedCategory);
      }, 100);
    } else {
      // Default to the first category
      const defaultCategory = treatmentsData[0]?.category || null;
      setActiveCategory(defaultCategory);

      if (defaultCategory) {
        setTimeout(() => {
          scrollToCategory(defaultCategory);
        }, 100);
      }
    }
  }, [state]);

  // Update activeCategory based on the currently visible category
  useEffect(() => {
    const handleScroll = () => {
      let currentCategory = activeCategory;

      for (const category of categories) {
        const element = document.getElementById(category.category);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            currentCategory = category.category;
            break;
          }
        }
      }

      if (currentCategory !== activeCategory) {
        setActiveCategory(currentCategory);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, activeCategory]);

  const handleCategoryClick = (selectedCategory: string) => {
    setActiveCategory(selectedCategory);
    scrollToCategory(selectedCategory);
  };

  return (
    <div className="treatments-page">
      {/* Navigation Menu */}
      <div className="navigation-menu">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`nav-item ${activeCategory === cat.category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.category)}
          >
            {cat.category}
          </div>
        ))}
      </div>

      {/* Chips for Mobile/Compact View */}
      <div className="categories-chips">
        {categories.map((cat, index) => (
          <Chip
            key={index}
            label={cat.category}
            onClick={() => handleCategoryClick(cat.category)}
            className={`chip ${activeCategory === cat.category ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Categories and Treatments */}
      <div className="categories-list" style={{ paddingBottom: 'var(--dynamic-padding)' }}>
        {categories.map((cat, index) => (
          <div key={index} id={cat.category} className="category-box">
            <h2 className="category-name">{cat.category}</h2>
            <div className="treatments-list">
              {cat.treatments.map((treatment, i) => (
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