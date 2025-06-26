import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      )
    }

    const uploadedFiles = []

    // Criar diretório de uploads se não existir
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'reviews')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Diretório já existe
    }

    for (const file of files) {
      // Validações
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Max size is 10MB` },
          { status: 400 }
        )
      }

      // Verificar tipo de arquivo
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
        'video/mov',
        'video/avi'
      ]

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 }
        )
      }

      // Gerar nome único para o arquivo
      const fileExtension = file.name.split('.').pop()
      const uniqueFilename = `${uuidv4()}.${fileExtension}`
      const filePath = join(uploadsDir, uniqueFilename)

      // Salvar arquivo
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Determinar tipo de mídia
      const mediaType = file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO'

      uploadedFiles.push({
        filename: uniqueFilename,
        originalName: file.name,
        url: `/uploads/reviews/${uniqueFilename}`,
        type: mediaType,
        size: file.size,
        mimeType: file.type,
      })
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

// Configuração para permitir arquivos grandes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
} 