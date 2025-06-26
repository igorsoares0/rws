import { NextRequest, NextResponse } from 'next/server'
import { postService } from '@/lib/db'

export async function GET() {
  try {
    const posts = await postService.getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, authorId } = body

    if (!title || !authorId) {
      return NextResponse.json(
        { error: 'Title and authorId are required' },
        { status: 400 }
      )
    }

    const post = await postService.createPost({ title, content, authorId })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 