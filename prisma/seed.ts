import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.reviewMedia.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()

  // Criar usuários
  const user1 = await prisma.user.create({
    data: {
      email: 'joao@example.com',
      name: 'João Silva',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      name: 'Maria Santos',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'pedro@example.com',
      name: 'Pedro Oliveira',
    },
  })

  console.log('✅ Usuários criados:', { user1: user1.id, user2: user2.id, user3: user3.id })

  // Criar categorias
  const category1 = await prisma.category.create({
    data: {
      name: 'Tecnologia',
      description: 'Produtos eletrônicos e gadgets',
    },
  })

  const category2 = await prisma.category.create({
    data: {
      name: 'Casa & Jardim',
      description: 'Produtos para casa e decoração',
    },
  })

  console.log('✅ Categorias criadas:', { category1: category1.id, category2: category2.id })

  // Criar produtos
  const product1 = await prisma.product.create({
    data: {
      name: 'Smartphone XYZ Pro',
      description: 'Smartphone premium com câmera de 108MP, 5G e bateria de longa duração. Ideal para fotografia e produtividade.',
      price: 1299.99,
      sku: 'PHONE-XYZ-PRO-001',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: 'Fone de Ouvido Bluetooth',
      description: 'Fone de ouvido sem fio com cancelamento de ruído ativo e 30 horas de bateria.',
      price: 299.99,
      sku: 'HEADPHONE-BT-001',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    },
  })

  const product3 = await prisma.product.create({
    data: {
      name: 'Cafeteira Automática',
      description: 'Cafeteira com moedor integrado, 12 programas de café e timer programável.',
      price: 899.99,
      sku: 'COFFEE-AUTO-001',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    },
  })

  const product4 = await prisma.product.create({
    data: {
      name: 'Smartwatch Fitness',
      description: 'Relógio inteligente com monitoramento de saúde, GPS e resistência à água.',
      price: 599.99,
      sku: 'WATCH-FIT-001',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    },
  })

  console.log('✅ Produtos criados:', { 
    product1: product1.id, 
    product2: product2.id, 
    product3: product3.id,
    product4: product4.id 
  })

  // Criar posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Como escolher o smartphone ideal',
      content: 'Guia completo para escolher o melhor smartphone para suas necessidades...',
      published: true,
      authorId: user1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'Dicas de café em casa',
      content: 'Aprenda a fazer o café perfeito em casa com nossas dicas...',
      published: true,
      authorId: user2.id,
    },
  })

  console.log('✅ Posts criados:', { post1: post1.id, post2: post2.id })

  // Criar reviews
  const review1 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excelente smartphone! A câmera é incrível e a bateria dura o dia todo. Muito satisfeito com a compra.',
      productId: product1.id,
      userId: user1.id,
      verified: true,
    },
  })

  const review2 = await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Bom produto, mas o preço poderia ser melhor. A qualidade de som é ótima.',
      productId: product2.id,
      userId: user2.id,
      verified: true,
    },
  })

  const review3 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Melhor cafeteira que já tive! O café fica perfeito e é muito fácil de usar.',
      productId: product3.id,
      userId: user3.id,
      verified: true,
    },
  })

  const review4 = await prisma.review.create({
    data: {
      rating: 3,
      comment: 'Produto mediano. Funciona bem mas esperava mais recursos.',
      productId: product1.id,
      customerName: 'Ana Costa',
      customerEmail: 'ana@example.com',
      verified: false,
    },
  })

  const review5 = await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Smartwatch muito bom para atividades físicas. A bateria dura bastante.',
      productId: product4.id,
      customerName: 'Carlos Lima',
      customerEmail: 'carlos@example.com',
      verified: true,
    },
  })

  const review6 = await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Som incrível! Cancelamento de ruído funciona perfeitamente.',
      productId: product2.id,
      customerName: 'Fernanda Silva',
      customerEmail: 'fernanda@example.com',
      verified: true,
    },
  })

  console.log('✅ Reviews criadas:', { 
    review1: review1.id, 
    review2: review2.id, 
    review3: review3.id,
    review4: review4.id,
    review5: review5.id,
    review6: review6.id
  })

  console.log('🎉 Seed concluído com sucesso!')
  
  // Estatísticas finais
  const totalUsers = await prisma.user.count()
  const totalProducts = await prisma.product.count()
  const totalReviews = await prisma.review.count()
  const totalPosts = await prisma.post.count()
  
  console.log('📊 Estatísticas finais:')
  console.log(`   - ${totalUsers} usuários`)
  console.log(`   - ${totalProducts} produtos`)
  console.log(`   - ${totalReviews} reviews`)
  console.log(`   - ${totalPosts} posts`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 