import '../styles/components/medicreviewcard.scss'

interface MedicReviewCardProps {
    medic: string;
    image: string;
    rating: number;
    patients: number;
  }
  
  function MedicReviewCard({ medic, image, rating, patients }: MedicReviewCardProps) {
    return (
      <div className="medic-review-card">
        <div className="medic-review-image">
          {/* Assuming you'll pass the image URL */}
          <img src={image} alt={`${medic}`} />
        </div>
        <div className="medic-review-info">
          <h3>{medic}</h3>
          <p>Rating: {rating} stars</p>
          <div className="stars">
            {'*'.repeat(rating)} {/* Simplified star representation */}
          </div>
        </div>
        <div className="medic-review-number">
          <span>{patients} patients</span>
        </div>
      </div>
    );
  }
  
  export default MedicReviewCard;
  