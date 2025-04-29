import { ReviewInterface } from "@/app/Interfaces";

interface ReviewProps {
  review: ReviewInterface;
}

const Review: React.FC<ReviewProps> = ({review}) => { 
  return (
    <div className="mb-4 rounded-lg bg-white p-6 text-gray-800 shadow-md">
         <h2>User: {review.username}</h2>
      <h2>Rating: {review.rating}</h2>
      <h2>Comment: {review.rating}</h2>
      <h2>date: {review.created_at}</h2>
      
    </div>
  );
}
interface ReviewListProps {
  reviews: ReviewInterface[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="rounded-lg bg-white p-6 text-gray-800 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Reviews</h1>
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  );
}
export default ReviewList;
