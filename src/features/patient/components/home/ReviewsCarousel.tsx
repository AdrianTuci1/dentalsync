import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "./ReviewsCarousel.module.scss"; // Import SCSS Module

interface Review {
  content: string;
  name: string;
}

const reviews: Review[] = [
  { content: "Un serviciu excelent și o echipă foarte prietenoasă!", name: "Ana Maria" },
  { content: "Am avut parte de cea mai bună experiență la dentist!", name: "Ion Popescu" },
  { content: "Foarte profesionist, recomand cu încredere!", name: "Mihai Radu" }
];

const ReviewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024);

  // Listen for screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalItems = reviews.length;

  const prevReview = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const nextReview = () => {
    if (currentIndex < totalItems - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextReview,
    onSwipedRight: prevReview,
    trackMouse: true
  });

  return (
    <>
      {isSmallScreen ? (
        <section className={styles.reviewsContainer} {...handlers}>
          <div
            className={styles.carousel}
            style={{
              transform: currentIndex === 0
                ? "translateX(18%)"
                : currentIndex === totalItems - 1
                ? "translateX(-18%)"
                : "translateX(0)"
            }}
          >
            {reviews.map((review, index) => {
              const position = index === currentIndex
                ? styles.centered
                : index === currentIndex - 1 || index === currentIndex + 1
                ? styles.partial
                : styles.hidden;

              return (
                <div key={index} className={`${styles.reviewBox} ${position}`}>
                  <h1>"</h1>
                  <p className={styles.content}>{review.content}</p>
                  <h3 className={styles.revName}>{review.name}</h3>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button className={`${styles.navBtn} ${styles.left}`} onClick={prevReview} disabled={currentIndex === 0}>
            {"‹"}
          </button>
          <button className={`${styles.navBtn} ${styles.right}`} onClick={nextReview} disabled={currentIndex === reviews.length - 1}>
            {"›"}
          </button>
        </section>
      ) : (
        <section className={styles.reviewsStatic}>
          {reviews.map((review, index) => (
            <div key={index} className={styles.reviewBoxStatic}>
              <h1>"</h1>
              <p className={styles.content}>{review.content}</p>
              <h3 className={styles.revName}>{review.name}</h3>
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default ReviewsCarousel;