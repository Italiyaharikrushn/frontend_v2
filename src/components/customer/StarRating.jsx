import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating, totalReviews, showCount = true, size = 16, color = '#fbbf24' }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} size={size} fill={color} color={color} />
                ))}
                {hasHalfStar && <StarHalf size={size} fill={color} color={color} />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} size={size} color={color} />
                ))}
            </div>
            {showCount && (
                <span className="text-sm text-gray-500 ml-1">
                    ({totalReviews || 0})
                </span>
            )}
        </div>
    );
};

export default StarRating;
