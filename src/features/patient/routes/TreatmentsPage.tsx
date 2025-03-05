import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { Chip } from "@mui/material";
import styles from "../styles/pages/TreatmentsPage.module.scss";
import CategoryService from "@/api/services/categoryService";
import { getSubdomain } from "@/shared/utils/getSubdomains";

interface Treatment {
  name: string;
  price: string;
}

const TreatmentsPage: React.FC = () => {
  const [categories, setCategories] = useState<Record<string, Treatment[]>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const categoryServiceRef = useRef<CategoryService | null>(null);

  const isMobile = window.innerWidth <= 768;

  // 📌 Inițializare CategoryService
  useEffect(() => {
    categoryServiceRef.current = new CategoryService(`${getSubdomain()}_db`);
  }, []);

  // 📌 Funcție pentru a prelua datele din API
  const fetchCategories = useCallback(async () => {
    if (!categoryServiceRef.current) return;

    try {
      const data = await categoryServiceRef.current.getAllCategories();

      if (data && typeof data === "object" && !Array.isArray(data)) {
        setCategories(data as Record<string, Treatment[]>);

        // Setează prima categorie ca activă după încărcare
        const firstCategory = Object.keys(data)[0] || null;
        setActiveCategory(firstCategory);
      } else {
        console.error("Invalid API response format:", data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

      for (const category in categories) {
        const el = categoryRefs.current[category];
        if (el) {
          const dist = Math.abs(el.offsetTop - container.offsetTop - scrollPos);
          if (dist < minDist) {
            minDist = dist;
            closestCategory = category;
          }
        }
      }

      if (closestCategory !== activeCategory) {
        setActiveCategory(closestCategory);
      }

      // 📌 Oprește scroll-ul la ultima categorie
      const lastCategory = Object.keys(categories).pop();
      const lastEl = categoryRefs.current[lastCategory!];
      if (lastEl && scrollPos >= lastEl.offsetTop - container.offsetTop) {
        container.scrollTop = lastEl.offsetTop - container.offsetTop;
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [categories, activeCategory]);

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar Desktop */}
      {!isMobile && (
        <aside className={styles.sidebar}>
          <div className={styles.sidebarList}>
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                className={`${styles.navItem} ${activeCategory === category ? styles.active : ""}`}
                onClick={() => scrollToCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className={styles.mobileNav}>
          {Object.keys(categories).map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => scrollToCategory(category)}
              className={`${styles.chip} ${activeCategory === category ? styles.activeChip : ""}`}
            />
          ))}
        </div>
      )}

      <main className={styles.contentContainer} ref={contentRef}>
        <div className={styles.contentWrapper}>
          {Object.entries(categories).map(([category, treatments]) => (
            <section
              key={category}
              id={category}
              className={styles.categorySection}
              ref={(el) => {
                if (el) categoryRefs.current[category] = el as HTMLDivElement;
              }}
            >
              <h2 className={styles.categoryTitle}>{category}</h2>
              <div className={styles.treatmentList}>
                {treatments.map((t, i) => (
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