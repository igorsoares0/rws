import { NextRequest, NextResponse } from 'next/server'

// URL do Minimal Reviews - configurável via variável de ambiente
const MINIMAL_REVIEWS_URL = process.env.MINIMAL_REVIEWS_URL || 'https://minimalreviews.vercel.app'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token obrigatório' },
        { status: 400 }
      )
    }

    // Fazer chamada para o Minimal Reviews para marcar como respondido
    const response = await fetch(`${MINIMAL_REVIEWS_URL}/api/mark-responded`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Erro ao marcar convite como respondido' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Erro ao marcar convite como respondido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 