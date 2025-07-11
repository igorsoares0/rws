import { NextRequest, NextResponse } from 'next/server'

// URL do Minimal Reviews - configurável via variável de ambiente
const MINIMAL_REVIEWS_URL = process.env.MINIMAL_REVIEWS_URL || 'https://minimal-reviews.com'

export async function POST(request: NextRequest) {
  try {
    const { token, productId, shop } = await request.json()

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token obrigatório' },
        { status: 400 }
      )
    }

    // Fazer chamada para o Minimal Reviews para validar o convite
    const response = await fetch(`${MINIMAL_REVIEWS_URL}/api/validate-invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, productId })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { valid: false, error: data.error || 'Erro ao validar convite' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Erro ao validar convite:', error)
    return NextResponse.json(
      { valid: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 