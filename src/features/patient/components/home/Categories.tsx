import React from "react";
import { IoArrowForward } from "react-icons/io5";
import styles from "../../styles/HomePage.module.scss";

interface Props {
  categories: { name: string; color: string }[];
  handleCategoryClick: (categoryName: string) => void;
}

const Categories: React.FC<Props> = ({ categories, handleCategoryClick }) => {
  return (
    <section className={styles.categories}>
        {categories.map((category, index) => {

        return (
            <div
            key={index}
            className={styles.box}
            style={{
                backgroundColor: category.color,
            }}
            onClick={() => handleCategoryClick(category.name)}
            >
            <p className={styles.identifier}>CATEGORIE</p>
            <p className={styles.categoryName}>{category.name}</p>
            <div className={styles.arrowBox}>
                <IoArrowForward className={styles.arrowIcon} />
            </div>
            </div>
        );
        })}
    </section>
  );
};

export default Categories;