'use client'

import { useState, useRef } from 'react'
import StarRating from './StarRating'

interface ReviewFormProps {
  productId: string
  onSubmitSuccess?: (review: any) => void
  onCancel?: () => void
  prefillData?: {
    customerName?: string
    customerEmail?: string
  }
}

interface UploadedFile {
  filename: string
  originalName: string
  url: string
  type: 'IMAGE' | 'VIDEO'
  size: number
  mimeType: string
}

export default function ReviewForm({ productId, onSubmitSuccess, onCancel, prefillData }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [customerName, setCustomerName] = useState(prefillData?.customerName || '')
  const [customerEmail, setCustomerEmail] = useState(prefillData?.customerEmail || '')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload files')
      }

      const data = await response.json()
      setUploadedFiles(prev => [...prev, ...data.files])
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload files')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Por favor, selecione uma avaliação')
      return
    }

    if (!customerName.trim() && !customerEmail.trim()) {
      setError('Por favor, informe seu nome ou email')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const reviewData = {
        rating,
        comment: comment.trim() || undefined,
        productId,
        customerName: customerName.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        media: uploadedFiles.length > 0 ? uploadedFiles.map(file => ({
          type: file.type,
          url: file.url,
          filename: file.filename,
          size: file.size,
        })) : undefined,
      }

      // Se tem onSubmitSuccess, usar ele (caso de convites)
      if (onSubmitSuccess) {
        onSubmitSuccess(reviewData)
        
        // Reset form
        setRating(0)
        setComment('')
        setCustomerName('')
        setCustomerEmail('')
        setUploadedFiles([])
        return
      }

      // Caso contrário, enviar direto para API (uso normal)
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }

      const review = await response.json()
      
      // Reset form
      setRating(0)
      setComment('')
      setCustomerName('')
      setCustomerEmail('')
      setUploadedFiles([])
    } catch (error) {
      console.error('Submit error:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Deixe sua Avaliação</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avaliação *
          </label>
          <div className="flex items-center space-x-2">
            <StarRating 
              rating={rating} 
              onRatingChange={setRating}
              size="lg"
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600">
                {rating === 1 && 'Muito ruim'}
                {rating === 2 && 'Ruim'}
                {rating === 3 && 'Regular'}
                {rating === 4 && 'Bom'}
                {rating === 5 && 'Excelente'}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comentário
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Compartilhe sua experiência com este produto..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
              Seu Nome
            </label>
            <input
              type="text"
              id="customerName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite seu nome"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Seu Email
            </label>
            <input
              type="email"
              id="customerEmail"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite seu email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos e Vídeos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Enviando...' : 'Adicionar Arquivos'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                PNG, JPG, GIF, MP4, WEBM até 10MB cada
              </p>
            </div>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type === 'IMAGE' ? (
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-24 object-cover rounded-lg"
                      controls={false}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                    {file.type === 'VIDEO' ? '🎥' : '📷'} {file.originalName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
        </div>
      </form>
    </div>
  )
} 