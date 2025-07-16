import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import cloudinary from '@/lib/cloudinary'

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

      // Upload para Cloudinary
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Determinar tipo de mídia e configurar upload
      const isImage = file.type.startsWith('image/')
      const mediaType = isImage ? 'IMAGE' : 'VIDEO'
      
      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.type};base64,${buffer.toString('base64')}`,
        {
          resource_type: isImage ? 'image' : 'video',
          folder: 'reviews',
          public_id: uniqueFilename.split('.')[0],
          overwrite: true,
        }
      )

      uploadedFiles.push({
        filename: uniqueFilename,
        originalName: file.name,
        url: uploadResult.secure_url,
        type: mediaType,
        size: file.size,
        mimeType: file.type,
        cloudinaryId: uploadResult.public_id,
      })
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: 'Failed to upload files', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

 