'use client'

import { useState, useEffect } from 'react'
import ReviewForm from '@/components/ReviewForm'
import ReviewList from '@/components/ReviewList'

export default function ReviewsPage() {
  const [productId, setProductId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshReviews, setRefreshReviews] = useState(0)

  useEffect(() => {
    initializeProduct()
  }, [])

  const initializeProduct = async () => {
    try {
      // Primeiro, tenta buscar produtos existentes
      const productsResponse = await fetch('/api/products')
      if (productsResponse.ok) {
        const products = await productsResponse.json()
        if (products.length > 0) {
          setProductId(products[0].id)
          setLoading(false)
          return
        }
      }

      // Se não há produtos, cria um produto de exemplo
      const createResponse = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Produto de Exemplo',
          description: 'Este é um produto de exemplo para demonstrar o sistema de avaliações.',
          price: 99.99,
          sku: 'EXAMPLE-001',
        }),
      })

      if (createResponse.ok) {
        const newProduct = await createResponse.json()
        setProductId(newProduct.id)
      } else {
        console.error('Failed to create example product')
      }
    } catch (error) {
      console.error('Error initializing product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmitted = (review: any) => {
    console.log('Review submitted:', review)
    alert('Avaliação enviada com sucesso!')
    // Força a atualização da lista de reviews
    setRefreshReviews(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!productId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar produto
          </h2>
          <p className="text-gray-600">
            Não foi possível inicializar o sistema de avaliações.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Formulário de Review */}
        <div className="max-w-2xl mx-auto">
          <ReviewForm
            productId={productId}
            onSubmitSuccess={handleReviewSubmitted}
          />
        </div>

        {/* Lista de Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ReviewList 
            productId={productId} 
            key={refreshReviews} // Força re-render quando uma nova review é adicionada
          />
        </div>
      </div>
    </div>
  )
} 