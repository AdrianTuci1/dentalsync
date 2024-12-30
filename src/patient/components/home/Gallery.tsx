import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import '../../styles/gallery.scss';

const images = [
  '/democlinic.jpg',
  '/image2.jpg',
  '/image3.jpg',
  '/image4.jpg',
];

const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    trackMouse: true, // Enables swiping via mouse for desktop
  });

  return (
    <div className="gallery-container" {...handlers}>
      <div className="image-wrapper">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Gallery Image ${index + 1}`}
            className={`gallery-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <button className="gallery-button prev" onClick={prevImage}>
        &#10094;
      </button>
      <button className="gallery-button next" onClick={nextImage}>
        &#10095;
      </button>
    </div>
  );
};

export default Gallery;