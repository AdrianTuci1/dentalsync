import React, { ReactNode, FunctionComponent, useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import '../../styles/gallery.scss';

type Direction = 'NEXT' | 'PREV';
const NEXT: Direction = 'NEXT';
const PREV: Direction = 'PREV';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case NEXT:
      return {
        ...state,
        dir: NEXT,
        sliding: true,
        pos: (state.pos + 1) % action.numItems,
      };
    case PREV:
      return {
        ...state,
        dir: PREV,
        sliding: true,
        pos: (state.pos === 0 ? action.numItems - 1 : state.pos - 1),
      };
    case 'setIndex':
      return {
        ...state,
        pos: action.index,
        sliding: false,
      };
    case 'stopSliding':
      return { ...state, sliding: false };
    default:
      return state;
  }
};

const getInitialState = (_: number) => ({
  pos: 0,
  sliding: false,
  dir: NEXT,
});

const Carousel: FunctionComponent<{
  children: ReactNode;
  currentIndex: number;
  onSlideChange: (index: number) => void;
}> = ({ children, currentIndex, onSlideChange }) => {
  const numItems = React.Children.count(children);
  const [state, dispatch] = React.useReducer(reducer, getInitialState(numItems));

  React.useEffect(() => {
    dispatch({ type: 'setIndex', index: currentIndex });
  }, [currentIndex]);

  const slide = (dir: Direction) => {
    const newIndex =
      dir === NEXT
        ? (state.pos + 1) % numItems
        : state.pos === 0
        ? numItems - 1
        : state.pos - 1;

    onSlideChange(newIndex); // Notify parent
    dispatch({ type: dir, numItems });

    setTimeout(() => {
      dispatch({ type: 'stopSliding' });
    }, 50);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => slide(NEXT),
    onSwipedRight: () => slide(PREV),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="carousel-wrapper" {...handlers}>
      <div className="carousel-container">
        <div
          className={`carousel-inner ${state.sliding ? 'sliding' : ''} ${state.dir}`}
          style={{ transform: `translateX(-${state.pos * 100}%)` }}
        >
          {React.Children.map(children, (child) => (
            <div className="carousel-slot">{child}</div>
          ))}
        </div>
      </div>
      <div className="carousel-buttons">
        <button onClick={() => slide(PREV)} className="carousel-btn prev">
          &#10094;
        </button>
        <button onClick={() => slide(NEXT)} className="carousel-btn next">
          &#10095;
        </button>
      </div>
    </div>
  );
};


const Gallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Simulate an API call to fetch images
    const fetchImages = async () => {
      const fetchedImages = [
        '/Reception3.webp',
        '/democlinic.jpg',
        '/cabinet2.png',
        '/image4.jpg',
      ];
      setImages(fetchedImages);
    };

    fetchImages();
  }, []);

  const handleSlideChange = (index: number) => {
    setCurrentIndex(index); // Sync current index
  };

  return (
    <div className="gallery-wrapper">
      <Carousel currentIndex={currentIndex} onSlideChange={handleSlideChange}>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index}`} />
        ))}
      </Carousel>
      <div className="gallery-thumbnails">
        {images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          >
            <img src={image} alt={`Thumbnail ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;


