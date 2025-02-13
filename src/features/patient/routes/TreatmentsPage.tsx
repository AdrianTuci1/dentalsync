import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/pages/TreatmentsPage.module.scss';
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
  const [activeCategory, setActiveCategory] = useState(treatmentsData[0]?.category || "");
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth <= 768;

  // Scroll to the selected category container
  const scrollToCategory = (category: string) => {
    const targetElement = document.getElementById(category);
    if (targetElement) {
      const yOffset = 0; // offset to compensate for sticky headers
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - yOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const finalPosition = Math.min(targetPosition, maxScroll);
      window.scrollTo({ top: finalPosition, behavior: "smooth" });
      setActiveCategory(category);
    }
  };

  // Update active category on manual scroll
  useEffect(() => {
    const handleScroll = () => {
      // Loop through categories and find the one that is near the top of viewport
      for (const category of treatmentsData) {
        const element = document.getElementById(category.category);
        if (element) {
          const rect = element.getBoundingClientRect();
          // When the top of the element is near 100px from top,
          // we consider that category active.
          if (rect.top <= 0 && rect.bottom > 100) {
            if (activeCategory !== category.category) {
              setActiveCategory(category.category);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory]);

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar Navigation (Desktop) */}
      {!isMobile && (
        <aside className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Categorii</h3>
          <div className={styles.sidebarList}>
            {treatmentsData.map((cat, index) => (
              <button
                key={index}
                className={`${styles.navItem} ${activeCategory === cat.category ? styles.active : ""}`}
                onClick={() => scrollToCategory(cat.category)}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className={styles.mobileNav}>
          {treatmentsData.map((cat, index) => (
            <Chip
              key={index}
              label={cat.category}
              onClick={() => scrollToCategory(cat.category)}
              className={`${styles.chip} ${activeCategory === cat.category ? styles.activeChip : ""}`}
            />
          ))}
        </div>
      )}

      {/* Treatments List (Each Category in Its Own Container) */}
      <main className={styles.contentContainer} ref={contentRef}>
        {treatmentsData.map((cat, index) => (
          <section key={index} id={cat.category} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{cat.category}</h2>
            <div className={styles.treatmentList}>
              {cat.treatments.map((treatment, i) => (
                <div key={i} className={styles.treatmentCard}>
                  <span className={styles.treatmentName}>{treatment.name}</span>
                  <span className={styles.treatmentPrice}>{treatment.price}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default TreatmentsPage;