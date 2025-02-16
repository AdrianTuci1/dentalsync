import React from "react";
import { IoArrowForward } from "react-icons/io5";
import styles from "../../styles/HomePage.module.scss";

interface Props {
  categories: { name: string; color: string }[];
  handleCategoryClick: (categoryName: string) => void;
}

const Categories: React.FC<Props> = ({ categories, handleCategoryClick }) => {
  const maxBoxes = 4; // Always display 4 boxes

  // Fill missing categories with placeholders
  const filledCategories = [
    ...categories,
    ...Array(Math.max(0, maxBoxes - categories.length)).fill({
      name: "Categorie lipsa",
      color: "#ddd", // Default gray background
    }),
  ];

  return (
    <section className={styles.categories}>
      {filledCategories.map((category, index) => (
        <div
          key={index}
          className={styles.box}
          style={{ backgroundColor: category.color }}
          onClick={() => category.name !== "Categorie lipsa" && handleCategoryClick(category.name)}
        >
          <p className={styles.identifier}>CATEGORIE</p>
          <p className={styles.categoryName}>{category.name}</p>
          {category.name !== "Categorie lipsa" && (
            <div className={styles.arrowBox}>
              <IoArrowForward className={styles.arrowIcon} />
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Categories;