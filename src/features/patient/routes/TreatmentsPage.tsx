import React, { useLayoutEffect, useRef, useState } from "react";
import { Chip } from "@mui/material";
import styles from "../styles/pages/TreatmentsPage.module.scss";

const treatmentsData = [
  {
    category: "Preventive Care",
    treatments: [
      { name: "Teeth Cleaning", price: "$50" },
      { name: "Fluoride Treatment", price: "$30" },
      { name: "Sealants", price: "$40" },
      { name: "Oral Cancer Screening", price: "$70" },
      { name: "Periodontal Maintenance", price: "$90" },
    ],
  },
  {
    category: "Restorative Care",
    treatments: [
      { name: "Fillings", price: "$80" },
      { name: "Crowns", price: "$500" },
      { name: "Bridges", price: "$1200" },
      { name: "Inlays & Onlays", price: "$400" },
      { name: "Root Canal Therapy", price: "$900" },
      { name: "Denture Repair", price: "$250" },
    ],
  },
  {
    category: "Cosmetic Care",
    treatments: [
      { name: "Teeth Whitening", price: "$200" },
      { name: "Veneers", price: "$700" },
      { name: "Bonding", price: "$150" },
      { name: "Gum Contouring", price: "$350" },
      { name: "Smile Makeover", price: "$5000" },
    ],
  },
  {
    category: "Orthodontics",
    treatments: [
      { name: "Traditional Braces", price: "$3000" },
      { name: "Clear Aligners", price: "$4000" },
      { name: "Retainers", price: "$400" },
      { name: "Palatal Expanders", price: "$1500" },
      { name: "Space Maintainers", price: "$600" },
    ],
  },
  {
    category: "Oral Surgery",
    treatments: [
      { name: "Tooth Extraction", price: "$150" },
      { name: "Wisdom Tooth Removal", price: "$400" },
      { name: "Dental Implants", price: "$3000" },
      { name: "Bone Grafting", price: "$800" },
      { name: "Sinus Lift Surgery", price: "$1200" },
    ],
  },
  {
    category: "Periodontics",
    treatments: [
      { name: "Scaling & Root Planing", price: "$250" },
      { name: "Gum Grafting", price: "$900" },
      { name: "Laser Gum Therapy", price: "$500" },
      { name: "Periodontal Surgery", price: "$2000" },
    ],
  },
  {
    category: "Prosthodontics",
    treatments: [
      { name: "Dentures (Full)", price: "$1500" },
      { name: "Dentures (Partial)", price: "$800" },
      { name: "Implant-Supported Dentures", price: "$3500" },
      { name: "Crown Lengthening", price: "$1200" },
    ],
  },
];

const TreatmentsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(treatmentsData[0].category);
  const contentRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isMobile = window.innerWidth <= 768;

  // 📌 Funcție pentru scroll controlat
  const scrollToCategory = (category: string) => {
    const targetEl = categoryRefs.current[category];
    if (!contentRef.current || !targetEl) return;

    contentRef.current.scrollTo({
      top: targetEl.offsetTop - contentRef.current.offsetTop,
      behavior: "smooth",
    });

    setActiveCategory(category);
  };

  // 📌 Detectează categoria activă bazată pe scroll
  useLayoutEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollPos = container.scrollTop;
      let closestCategory = activeCategory;
      let minDist = Infinity;

      for (const cat of treatmentsData) {
        const el = categoryRefs.current[cat.category];
        if (el) {
          const dist = Math.abs(el.offsetTop - container.offsetTop - scrollPos);
          if (dist < minDist) {
            minDist = dist;
            closestCategory = cat.category;
          }
        }
      }

      if (closestCategory !== activeCategory) {
        setActiveCategory(closestCategory);
      }

      // 📌 Oprește scroll-ul la ultima categorie
      const lastEl = categoryRefs.current[treatmentsData[treatmentsData.length - 1].category];
      if (lastEl && scrollPos >= lastEl.offsetTop - container.offsetTop) {
        container.scrollTop = lastEl.offsetTop - container.offsetTop;
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [activeCategory]);

  return (
    <div className={styles.pageContainer}>
      {!isMobile && (
        <aside className={styles.sidebar}>
          <div className={styles.sidebarList}>
            {treatmentsData.map((cat) => (
              <button
                key={cat.category}
                className={`${styles.navItem} ${activeCategory === cat.category ? styles.active : ""}`}
                onClick={() => scrollToCategory(cat.category)}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </aside>
      )}

      {isMobile && (
        <div className={styles.mobileNav}>
          {treatmentsData.map((cat) => (
            <Chip
              key={cat.category}
              label={cat.category}
              onClick={() => scrollToCategory(cat.category)}
              className={`${styles.chip} ${activeCategory === cat.category ? styles.activeChip : ""}`}
            />
          ))}
        </div>
      )}

      <main className={styles.contentContainer} ref={contentRef}>
        <div className={styles.contentWrapper}>
          {treatmentsData.map((cat) => (
            <section
              key={cat.category}
              id={cat.category}
              className={styles.categorySection}
              ref={(el) => (categoryRefs.current[cat.category] = el)}
            >
              <h2 className={styles.categoryTitle}>{cat.category}</h2>
              <div className={styles.treatmentList}>
                {cat.treatments.map((t, i) => (
                  <div key={i} className={styles.treatmentCard}>
                    <span className={styles.treatmentName}>{t.name}</span>
                    <span className={styles.treatmentPrice}>{t.price}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TreatmentsPage;