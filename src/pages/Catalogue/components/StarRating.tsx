import React from 'react';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5]?.map(i => (
      <svg 
        key={i} 
        width="12" 
        height="12" 
        viewBox="0 0 24 24" 
        fill={i <= rating ? "#F59E0B" : "none"} 
        stroke={i <= rating ? "#F59E0B" : "#D1D5DB"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ))}
  </div>
);

export default StarRating;
