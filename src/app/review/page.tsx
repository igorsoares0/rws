'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReviewForm from '@/components/ReviewForm'

interface InvitationData {
  id: string
  productTitle: string
  productImage?: string
  customerName: string
  customerEmail: string
  shop: string
  productId: string
  valid: boolean
}

export default function ReviewPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const productId = searchParams.get('productId')
  const shop = searchParams.get('shop')
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (token && productId && shop) {
      validateInvitation()
    } else {
      setError('Link inválido. Parâmetros obrigatórios não encontrados.')
      setLoading(false)
    }
  }, [token, productId, shop])

  const validateInvitation = async () => {
    try {
      const response = await fetch('/api/validate-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, productId, shop })
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setInvitation(data.invitation)
      } else {
        setError(data.error || 'Convite inválido ou expirado')
      }
    } catch (err) {
      setError('Erro ao validar convite')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      // Salvar review no RWS
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewData,
          shopifyShop: shop,
          shopifyProductId: productId,
          invitationToken: token
        })
      })

      if (response.ok) {
        // Marcar convite como respondido
        await fetch('/api/mark-invitation-responded', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        setSubmitted(true)
      } else {
        throw new Error('Erro ao enviar review')
      }
    } catch (err) {
      setError('Erro ao enviar review. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando convite...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Obrigado pela sua avaliação!</h1>
          <p className="text-gray-600 mb-6">
            Sua opinião é muito importante para nós e para outros clientes.
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">
              Sua avaliação será processada e aparecerá na loja em breve.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⭐ Avalie sua experiência
          </h1>
          <p className="text-gray-600">
            Olá {invitation?.customerName}! Como foi sua experiência com este produto?
          </p>
        </div>

        {/* Product Info */}
        {invitation && (
          <div className="max-w-2xl mx-auto mb-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4">
              {invitation.productImage && (
                <img 
                  src={invitation.productImage} 
                  alt={invitation.productTitle}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {invitation.productTitle}
                </h2>
                <p className="text-gray-600">
                  Comprado em {invitation.shop.replace('.myshopify.com', '')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        <ReviewForm 
          productId={productId!}
          onSubmitSuccess={handleReviewSubmit}
          prefillData={{
            customerName: invitation?.customerName,
            customerEmail: invitation?.customerEmail
          }}
        />
      </div>
    </div>
  )
} 