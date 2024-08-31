import { Review } from "../../types/statsType"
import MedicReviewCard from "../MedicReviewCard";

interface ClinicReviewProps{
    data: Review[];
}

const ClinicReviews: React.FC<ClinicReviewProps>= ({data}) => {
  return (
    <div>
      <h3 style={{textAlign:'left'}}>Reviews</h3>
      <div style={reviewContainer}>
        {data.map((review, index) => (
          <MedicReviewCard 
            key={index} 
            image={review.image}
            medic={review.medic} 
            rating={review.rating} 
            patients={review.patients} 
          />
        ))}
      </div>
    </div>
  )
}

const reviewContainer: React.CSSProperties = {
  width: '100%',
  height:'250px',
  display:'flex', 
  alignItems:'center',
  flexDirection:'column',
  gap:'10px',
  overflowY:'scroll',
  paddingBlock:'15px'
}

export default ClinicReviews