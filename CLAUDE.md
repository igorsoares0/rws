# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
npm run dev        # Start development server on port 3002 with Turbopack
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Database Operations
```bash
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Create and apply new migration
npm run db:migrate:deploy # Apply migrations in production
npm run db:migrate:reset  # Reset database and apply all migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database with initial data
npm run db:status       # Check migration status
npm run db:push         # Push schema changes to database
```

### Deployment
```bash
npm run vercel-build    # Vercel-specific build (generates Prisma client, applies migrations, builds Next.js)
```

## Architecture Overview

This is a Next.js 15 application with App Router that implements a Shopify-integrated product review system. The architecture follows these key patterns:

### Database Layer
- **Prisma ORM** with PostgreSQL database
- Models: User, Post, Product, Review, ReviewMedia, Category
- Reviews support both registered users and guest customers
- Shopify integration fields (`shopifyShop`, `shopifyProductId`, `invitationToken`)
- Media attachments (images/videos) stored via Cloudinary

### API Layer (`src/app/api/`)
- RESTful API routes using Next.js App Router
- Key endpoints:
  - `/api/reviews` - CRUD operations for reviews
  - `/api/products` - Product management
  - `/api/upload` - File upload to Cloudinary
  - `/api/users` - User management
- All API routes include proper error handling and validation

### Frontend Components (`src/components/`)
- **ReviewForm** - Complete review submission with media upload
- **ReviewList** - Display reviews with helpful voting
- **StarRating** - Interactive rating component
- **UserList** - User management interface

### Core Services (`src/lib/`)
- **prisma.ts** - Prisma client configuration with connection pooling
- **db.ts** - Business logic and data access layer (reviewService)
- **cloudinary.ts** - File upload and media management

### Key Features
1. **Shopify Integration**: Supports review invitations from Shopify stores
2. **Guest Reviews**: Allow reviews without user registration
3. **Media Support**: Image and video uploads via Cloudinary
4. **Helpful Voting**: Users can mark reviews as helpful
5. **Product Auto-creation**: Products are created automatically from Shopify data

## Development Notes

### Database Schema
- Reviews can be linked to either registered users (`userId`) or guest customers (`customerName`/`customerEmail`)
- Products support Shopify integration with `shopifyProductId` mapping
- Media files are stored externally (Cloudinary) with metadata in `ReviewMedia` table

### File Upload Flow
1. Files uploaded to `/api/upload` endpoint
2. Files stored in Cloudinary with organized folder structure
3. Metadata returned to frontend for review submission
4. Review creation links media records to review

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- Cloudinary configuration (see `src/lib/cloudinary.ts`)

### Port Configuration
- Development server runs on port 3002 (configured in package.json)
- Avoid port conflicts with other applications

### Vercel Deployment
- Uses custom build command that handles Prisma generation and migrations
- API routes have 30-second timeout configuration
- Framework detection set to Next.js