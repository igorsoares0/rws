import { NextResponse } from 'next/server'
import { productService } from '@/lib/db'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id
    const product = await productService.getProductById(id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Obter estatísticas detalhadas
    const stats = await productService.getProductStats(id)

    return NextResponse.json({
      ...product,
      ...stats,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id
    const body = await request.json()
    const { name, description, price, imageUrl, sku, active } = body

    const product = await productService.updateProduct(id, {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      imageUrl,
      sku,
      active,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id
    await productService.deleteProduct(id)
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}