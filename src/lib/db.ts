import { prisma } from './prisma'

// User operations
export const userService = {
  async createUser(data: { email: string; name?: string }) {
    return await prisma.user.create({
      data,
    })
  },

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    })
  },

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        posts: true,
      },
    })
  },

  async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        posts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async updateUser(id: string, data: { email?: string; name?: string }) {
    return await prisma.user.update({
      where: { id },
      data,
    })
  },

  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    })
  },
}

// Post operations
export const postService = {
  async createPost(data: { title: string; content?: string; authorId: string }) {
    return await prisma.post.create({
      data,
      include: {
        author: true,
      },
    })
  },

  async getPostById(id: string) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })
  },

  async getAllPosts() {
    return await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async getPublishedPosts() {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async updatePost(id: string, data: { title?: string; content?: string; published?: boolean }) {
    return await prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    })
  },

  async deletePost(id: string) {
    return await prisma.post.delete({
      where: { id },
    })
  },
}

// Category operations
export const categoryService = {
  async createCategory(data: { name: string; description?: string }) {
    return await prisma.category.create({
      data,
    })
  },

  async getCategoryById(id: string) {
    return await prisma.category.findUnique({
      where: { id },
    })
  },

  async getAllCategories() {
    return await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  },

  async updateCategory(id: string, data: { name?: string; description?: string }) {
    return await prisma.category.update({
      where: { id },
      data,
    })
  },

  async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id },
    })
  },
}

// Product operations
export const productService = {
  async createProduct(data: { 
    name: string; 
    description?: string; 
    price?: number; 
    imageUrl?: string; 
    sku?: string 
  }) {
    return await prisma.product.create({
      data,
    })
  },

  async getProductById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: true,
            media: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
  },

  async getAllProducts() {
    return await prisma.product.findMany({
      where: {
        active: true,
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async updateProduct(id: string, data: { 
    name?: string; 
    description?: string; 
    price?: number; 
    imageUrl?: string; 
    sku?: string;
    active?: boolean 
  }) {
    return await prisma.product.update({
      where: { id },
      data,
    })
  },

  async deleteProduct(id: string) {
    return await prisma.product.delete({
      where: { id },
    })
  },

  async getProductStats(id: string) {
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      select: { rating: true },
    })

    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / totalReviews 
      : 0

    const ratingDistribution = {
      5: reviews.filter((r: { rating: number }) => r.rating === 5).length,
      4: reviews.filter((r: { rating: number }) => r.rating === 4).length,
      3: reviews.filter((r: { rating: number }) => r.rating === 3).length,
      2: reviews.filter((r: { rating: number }) => r.rating === 2).length,
      1: reviews.filter((r: { rating: number }) => r.rating === 1).length,
    }

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    }
  },
}

// Review operations
export const reviewService = {
  async ensureProductExists(productId: string, productData: {
    name: string;
    description?: string;
    sku?: string;
  }) {
    console.log('🔍 Verificando produto:', productId);
    
    // Verificar se produto já existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      console.log('📦 Produto não existe, criando:', productData);
      // Criar produto se não existir
      const newProduct = await prisma.product.create({
        data: {
          id: productId,
          ...productData,
          active: true,
        }
      });
      console.log('✅ Produto criado:', newProduct.id);
    } else {
      console.log('✅ Produto já existe:', existingProduct.id);
    }
  },

  async createReview(data: {
    rating: number;
    comment?: string;
    productId: string;
    userId?: string;
    customerName?: string;
    customerEmail?: string;
    shopifyShop?: string;
    shopifyProductId?: string;
    invitationToken?: string;
    media?: Array<{
      type: 'IMAGE' | 'VIDEO';
      url: string;
      filename?: string;
      size?: number;
    }>;
  }) {
    const { media, ...reviewData } = data

    return await prisma.review.create({
      data: {
        ...reviewData,
        media: media ? {
          create: media,
        } : undefined,
      },
      include: {
        user: true,
        product: true,
        media: true,
      },
    })
  },

  async getReviewById(id: string) {
    return await prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
        media: true,
      },
    })
  },

  async getReviewsByProduct(productId: string, limit?: number) {
    return await prisma.review.findMany({
      where: { productId },
      include: {
        user: true,
        media: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })
  },

  // TODO: Implementar após resolver problemas de schema
  // async getReviewsByShopifyShop(shopifyShop: string, limit?: number) {
  //   return await prisma.review.findMany({
  //     where: { shopifyShop },
  //     include: {
  //       user: true,
  //       product: true,
  //       media: true,
  //     },
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //     take: limit,
  //   })
  // },

  async getAllReviews() {
    return await prisma.review.findMany({
      include: {
        user: true,
        product: true,
        media: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async getReviewsByShopifyShop(shopifyShop: string) {
    return await prisma.review.findMany({
      where: {
        shopifyShop,
      },
      include: {
        user: true,
        product: true,
        media: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  async updateReview(id: string, data: {
    rating?: number;
    comment?: string;
    verified?: boolean;
    helpful?: number;
  }) {
    return await prisma.review.update({
      where: { id },
      data,
      include: {
        user: true,
        product: true,
        media: true,
      },
    })
  },

  async deleteReview(id: string) {
    return await prisma.review.delete({
      where: { id },
    })
  },

  async markAsHelpful(id: string) {
    return await prisma.review.update({
      where: { id },
      data: {
        helpful: {
          increment: 1,
        },
      },
    })
  },
}

// Review Media operations
export const reviewMediaService = {
  async createMedia(data: {
    reviewId: string;
    type: 'IMAGE' | 'VIDEO';
    url: string;
    filename?: string;
    size?: number;
  }) {
    return await prisma.reviewMedia.create({
      data,
    })
  },

  async getMediaByReview(reviewId: string) {
    return await prisma.reviewMedia.findMany({
      where: { reviewId },
      orderBy: {
        createdAt: 'asc',
      },
    })
  },

  async deleteMedia(id: string) {
    return await prisma.reviewMedia.delete({
      where: { id },
    })
  },
} 