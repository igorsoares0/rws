'use client'

import { useState } from 'react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  showValue?: boolean
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  size = 'md', 
  readonly = false,
  showValue = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  const getStarColor = (starNumber: number) => {
    const currentRating = hoverRating || rating
    if (starNumber <= currentRating) {
      return 'text-yellow-400 fill-current'
    }
    return 'text-gray-300'
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } transition-all duration-150 ${getStarColor(star)}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-full h-full"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          ({rating}/5)
        </span>
      )}
    </div>
  )
} 