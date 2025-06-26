import { NextRequest, NextResponse } from 'next/server'
import { reviewService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const shopifyShop = searchParams.get('shopifyShop')
    const limit = searchParams.get('limit')

    let reviews
    if (productId) {
      reviews = await reviewService.getReviewsByProduct(
        productId,
        limit ? parseInt(limit) : undefined
      )
    } else if (shopifyShop) {
      reviews = await reviewService.getReviewsByShopifyShop(shopifyShop)
    } else {
      reviews = await reviewService.getAllReviews()
    }

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📦 Body completo recebido:', JSON.stringify(body, null, 2));
    
    const { 
      rating, 
      comment, 
      productId, 
      userId, 
      customerName, 
      customerEmail,
      media,
      shopifyShop,
      shopifyProductId,
      invitationToken
    } = body

    // Validações básicas
    if (!rating || !productId) {
      return NextResponse.json(
        { error: 'Rating and productId are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Se não há userId, deve ter pelo menos customerName ou customerEmail
    if (!userId && !customerName && !customerEmail) {
      return NextResponse.json(
        { error: 'Customer name or email is required for guest reviews' },
        { status: 400 }
      )
    }

    // Se é uma review do Shopify, verificar/criar produto automaticamente
    console.log('🔍 Dados recebidos:', { productId, shopifyProductId, shopifyShop });
    
    if (shopifyProductId && shopifyShop) {
      console.log('✅ Criando/verificando produto:', productId);
      await reviewService.ensureProductExists(productId, {
        name: `Produto ${shopifyProductId}`,
        description: `Produto importado da loja ${shopifyShop}`,
        sku: shopifyProductId,
      });
      console.log('✅ Produto verificado/criado com sucesso');
    } else {
      console.log('❌ Dados do Shopify não encontrados, usando productId direto:', productId);
    }

    const review = await reviewService.createReview({
      rating: parseInt(rating),
      comment,
      productId,
      userId: userId || undefined,
      customerName: customerName || undefined,
      customerEmail: customerEmail || undefined,
      media: media || undefined,
      shopifyShop: shopifyShop || undefined,
      shopifyProductId: shopifyProductId || undefined,
      invitationToken: invitationToken || undefined,
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
} 