import { ReviewInterface } from "@/app/Interfaces";
import apiRequest from "@/lib/axios";
import { isoHumanDate } from "@/utils/date_formatter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

interface ReviewProps {
  review: ReviewInterface;
}


interface ReviewProps {
  review: {
    username: string;
    rating: number;
    comment: string;
    created_at: string; // Assuming this is an ISO date string
  };
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  const { username, rating, comment, created_at } = review;

  return (
    <div className="mb-4 rounded-lg bg-white p-6 text-gray-800 shadow-md transition-transform transform hover:scale-105">
      <h3 className="text-lg font-semibold">by: {username}</h3>
      <p className="text-sm text-gray-600">{new Array(rating).fill("⭐️").join("")}</p>
      <p className="mt-2">{comment}</p>
      <time className="block mt-4 text-xs text-gray-500">
        {isoHumanDate(created_at)}
      </time>
    </div>
  );
};


interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  siteId: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ isOpen, onClose,siteId  }) => {
  const queryClient = useQueryClient();
  const {mutate: leaveReview} = useMutation({
    mutationFn: async () => {
      apiRequest.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem("token")}`;
      const response = await apiRequest.post(`campsites/${siteId}/review`, newReview);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch campsite data
      queryClient.invalidateQueries({ queryKey: ['campsite',siteId, localStorage.getItem("token")] });
      // Close modal and reset form
      setNewReview({  rating: 5, comment: "" });
      onClose();
    },
    onError: (error) => {
      console.error("Error canceling reservation:", error);
    }
  });
  const [newReview, setNewReview] = useState<Partial<ReviewInterface>>({
    rating: 5,
    comment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    leaveReview()
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Leave a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="rating" className="mb-1 block text-sm font-medium">
              Rating
            </label>
            <select
              id="rating"
              name="rating"
              value={newReview.rating}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="mb-1 block text-sm font-medium">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              value={newReview.comment}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2"
              rows={4}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ReviewListProps {
  reviews: ReviewInterface[];
  siteId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, siteId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="rounded-lg bg-white p-6 text-gray-800 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <button
          onClick={handleOpenModal}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Leave a Review
        </button>
      </div>
      
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Review key={review.id} review={review} />
        ))
      ) : (
        <p className="text-center text-gray-500">No reviews yet. Be the first to leave a review!</p>
      )}
      
      <ReviewForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        siteId={siteId}
      />
    </div>
  );
};

export default ReviewList;
