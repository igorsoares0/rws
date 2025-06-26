'use client'

import { useState, useEffect } from 'react'
import StarRating from './StarRating'

interface Review {
  id: string
  rating: number
  comment?: string
  customerName?: string
  customerEmail?: string
  verified: boolean
  helpful: number
  createdAt: string
  user?: {
    name?: string
    email: string
  }
  media: Array<{
    id: string
    type: 'IMAGE' | 'VIDEO'
    url: string
    filename?: string
  }>
}

interface ReviewListProps {
  productId: string
  limit?: number
  showTitle?: boolean
}

export default function ReviewList({ productId, limit, showTitle = true }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [productId, limit])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ productId })
      if (limit) params.append('limit', limit.toString())
      
      const response = await fetch(`/api/reviews?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const markAsHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      })
      
      if (response.ok) {
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, helpful: review.helpful + 1 }
            : review
        ))
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Erro:</strong> {error}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Ainda não há avaliações para este produto.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <h3 className="text-xl font-semibold text-gray-900">
          Avaliações ({reviews.length})
        </h3>
      )}
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {(review.user?.name || review.customerName || 'A')[0].toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {review.user?.name || review.customerName || 'Cliente Anônimo'}
                    </h4>
                    {review.verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Compra Verificada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <StarRating rating={review.rating} readonly size="sm" />
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment */}
            {review.comment && (
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            )}

            {/* Media */}
            {review.media.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {review.media.map((media) => (
                    <div key={media.id} className="relative group cursor-pointer">
                      {media.type === 'IMAGE' ? (
                        <img
                          src={media.url}
                          alt="Review media"
                          className="w-full h-20 object-cover rounded-lg hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="relative">
                          <video
                            src={media.url}
                            className="w-full h-20 object-cover rounded-lg"
                            controls={false}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => markAsHelpful(review.id)}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Útil ({review.helpful})</span>
              </button>
              
              <div className="text-sm text-gray-400">
                ID: {review.id.slice(-8)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 