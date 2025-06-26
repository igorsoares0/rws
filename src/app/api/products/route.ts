import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/lib/db'

export async function GET() {
  try {
    const products = await productService.getAllProducts()
    
    // Calcular estatísticas de avaliação para cada produto
    const productsWithStats = products.map((product: any) => {
      const ratings = product.reviews.map((r: any) => r.rating)
      const totalReviews = ratings.length
      const averageRating = totalReviews > 0 
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / totalReviews 
        : 0

      return {
        ...product,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        reviews: undefined, // Remove reviews detalhados da listagem
      }
    })

    return NextResponse.json(productsWithStats)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, imageUrl, sku } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    const product = await productService.createProduct({
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      imageUrl,
      sku,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
} 