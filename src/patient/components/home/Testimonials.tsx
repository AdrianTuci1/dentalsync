import React from 'react';
import '../../styles/testimonials.scss';
import { FaStar } from 'react-icons/fa';


const testimonials = [
  {
    name: 'John Doe',
    photo: '/path/to/photo1.jpg',
    testimonial:
      'The service was outstanding! The staff was friendly, and my teeth have never felt cleaner.',
  },
  {
    name: 'Jane Smith',
    photo: '/path/to/photo2.jpg',
    testimonial:
      'Highly professional and caring. They explained everything clearly and made me feel at ease.',
  },
  {
    name: 'Emily Johnson',
    photo: '/path/to/photo3.jpg',
    testimonial:
      'Amazing experience! The clinic is clean, and the team is very skilled. I highly recommend it!',
  },
];

const Testimonials: React.FC = () => {
  const stars = [];

  // Add the component 5 times to the array
  for (let i = 0; i < 5; i++) {
    stars.push(<FaStar key={i} />);
  }

  return (
    <div className="customer-testimonials">
      <h3 className='testimonial-title'>{stars}</h3>
      <div className="testimonial-cards">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <p className="testimonial-text">{testimonial.testimonial}</p>
            <h4 className="customer-name">{testimonial.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;