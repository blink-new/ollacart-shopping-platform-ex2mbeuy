import { blink } from '@/blink/client'
import type { 
  Product, 
  ProductCreateRequest, 
  ProductUpdateRequest, 
  ProductSearchRequest,
  AffiliateLink,
  Retailer,
  CartItem,
  Collection,
  CollectionItem,
  SocialPost,
  AffiliateTrackingData
} from '@/types'

export class ProductService {
  // Product CRUD operations based on OllaCart controller
  static async createProduct(data: ProductCreateRequest): Promise<Product> {
    const user = await blink.auth.me()
    
    // Process image if needed (placeholder for now)
    const processedPhoto = {
      url: data.photo,
      small: data.photo, // Would be processed thumbnail
      normal: data.photo // Would be processed normal size
    }

    const domain = new URL(data.originalUrl || data.url).origin || ''
    
    const productData = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      anonymousId: '',
      name: data.name,
      description: data.description || '',
      keywords: JSON.stringify(data.keywords || []),
      price: data.price,
      color: data.color || '',
      size: data.size || '',
      shared: 0,
      purchased: 0,
      purchasedStatus: 0,
      photoUrl: processedPhoto.url,
      photoSmall: processedPhoto.small || '',
      photoNormal: processedPhoto.normal || '',
      photos: JSON.stringify(data.photos?.map(url => ({
        url,
        small: url, // Would be processed
        normal: url // Would be processed
      })) || []),
      url: data.url,
      originalUrl: data.originalUrl,
      domain,
      ceId: data.ceId || '',
      sequence: Date.now(),
      userId: user.id,
      categoryId: '',
      forkId: '',
      forkedIds: JSON.stringify([]),
      likes: JSON.stringify([]),
      dislikes: JSON.stringify([]),
      addedBy: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await blink.db.products.create(productData)
    return this.transformProduct(result)
  }

  static async updateProduct(id: string, data: ProductUpdateRequest): Promise<Product> {
    const updateData: any = {
      updatedAt: new Date().toISOString()
    }

    if (data.name) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.price !== undefined) updateData.price = data.price
    if (data.color !== undefined) updateData.color = data.color
    if (data.size !== undefined) updateData.size = data.size
    if (data.keywords) updateData.keywords = JSON.stringify(data.keywords)
    if (data.purchased !== undefined) updateData.purchased = data.purchased
    if (data.shared !== undefined) updateData.shared = data.shared
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
    if (data.photo) {
      updateData.photoUrl = data.photo.url
      updateData.photoSmall = data.photo.small || ''
      updateData.photoNormal = data.photo.normal || ''
    }
    if (data.photos) {
      updateData.photos = JSON.stringify(data.photos)
    }

    await blink.db.products.update(id, updateData)
    const updated = await blink.db.products.list({ where: { id } })
    return this.transformProduct(updated[0])
  }

  static async getProduct(id: string): Promise<Product | null> {
    const products = await blink.db.products.list({ where: { id } })
    return products.length > 0 ? this.transformProduct(products[0]) : null
  }

  static async searchProducts(params: ProductSearchRequest): Promise<{ data: Product[], size: number }> {
    try {
      const user = await blink.auth.me()
      const limit = params.limit || 100
      const skip = params.skip || 0

      const where: any = {}

      if (params.purchased) {
        where.purchased = 1
      }

      if (params.shared) {
        where.userId = params._id || user.id
        where.shared = 1
      } else if (params.social && params._ids) {
        // Social feed - products from followed users
        where.userId = { in: params._ids }
        where.shared = 1
      } else {
        where.userId = user.id
      }

      const products = await blink.db.products.list({
        where,
        orderBy: [
          { sequence: 'desc' },
          { createdAt: 'desc' }
        ],
        limit,
        // Note: Blink SDK doesn't support skip directly, would need pagination
      })

      const transformedProducts = products.map(p => this.transformProduct(p))
      
      return {
        data: transformedProducts,
        size: transformedProducts.length
      }
    } catch (error) {
      console.warn('Database not available, returning demo data:', error)
      
      // Return demo data when database is not available
      const demoProducts: Product[] = [
        {
          id: 'demo_1',
          anonymousId: '',
          name: 'Wireless Bluetooth Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          keywords: ['headphones', 'wireless', 'bluetooth', 'audio'],
          price: 89.99,
          color: 'Black',
          size: 'One Size',
          shared: 0,
          purchased: 0,
          purchasedStatus: 0,
          photo: {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            small: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
            normal: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
          },
          photos: [],
          url: 'https://amazon.com/demo-headphones',
          originalUrl: 'https://amazon.com/demo-headphones',
          domain: 'amazon.com',
          ceId: '',
          sequence: Date.now(),
          userId: 'demo_user',
          categoryId: 'electronics',
          forkId: '',
          forkedIds: [],
          likes: [],
          dislikes: [],
          addedBy: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'demo_2',
          anonymousId: '',
          name: 'Smart Fitness Watch',
          description: 'Track your fitness goals with this advanced smartwatch',
          keywords: ['watch', 'fitness', 'smart', 'health'],
          price: 199.99,
          color: 'Silver',
          size: '42mm',
          shared: 0,
          purchased: 0,
          purchasedStatus: 0,
          photo: {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            small: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
            normal: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
          },
          photos: [],
          url: 'https://bestbuy.com/demo-watch',
          originalUrl: 'https://bestbuy.com/demo-watch',
          domain: 'bestbuy.com',
          ceId: '',
          sequence: Date.now() - 1000,
          userId: 'demo_user',
          categoryId: 'electronics',
          forkId: '',
          forkedIds: [],
          likes: [],
          dislikes: [],
          addedBy: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'demo_3',
          anonymousId: '',
          name: 'Organic Cotton T-Shirt',
          description: 'Comfortable and sustainable organic cotton t-shirt',
          keywords: ['shirt', 'organic', 'cotton', 'clothing'],
          price: 29.99,
          color: 'Navy Blue',
          size: 'M',
          shared: 0,
          purchased: 0,
          purchasedStatus: 0,
          photo: {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
            small: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
            normal: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
          },
          photos: [],
          url: 'https://example-store.com/demo-shirt',
          originalUrl: 'https://example-store.com/demo-shirt',
          domain: 'example-store.com',
          ceId: '',
          sequence: Date.now() - 2000,
          userId: 'demo_user',
          categoryId: 'clothing',
          forkId: '',
          forkedIds: [],
          likes: [],
          dislikes: [],
          addedBy: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      return {
        data: demoProducts,
        size: demoProducts.length
      }
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    await blink.db.products.delete(id)
  }

  // Fork product (add to cart from another user)
  static async forkProduct(productId: string): Promise<Product> {
    const user = await blink.auth.me()
    const originalProduct = await this.getProduct(productId)
    
    if (!originalProduct) {
      throw new Error('Product not found')
    }

    if (originalProduct.userId === user.id) {
      throw new Error('You cannot add from your own cart')
    }

    // Check if already forked
    const existing = await blink.db.products.list({
      where: {
        userId: user.id,
        forkId: productId
      }
    })

    if (existing.length > 0) {
      throw new Error('Already added')
    }

    const forkedIds = [...(originalProduct.forkedIds || []), originalProduct.id]
    
    const forkData: ProductCreateRequest = {
      name: originalProduct.name,
      description: originalProduct.description,
      price: originalProduct.price,
      photo: originalProduct.photo.url,
      photos: originalProduct.photos?.map(p => p.url),
      url: originalProduct.url,
      originalUrl: originalProduct.originalUrl,
      color: originalProduct.color,
      size: originalProduct.size,
      keywords: originalProduct.keywords
    }

    const forkedProduct = await this.createProduct(forkData)
    
    // Update with fork information
    await blink.db.products.update(forkedProduct.id, {
      forkId: originalProduct.id,
      forkedIds: JSON.stringify(forkedIds)
    })

    return forkedProduct
  }

  // Like/Unlike product
  static async toggleLike(productId: string): Promise<Product> {
    const user = await blink.auth.me()
    const product = await this.getProduct(productId)
    
    if (!product) {
      throw new Error('Product not found')
    }

    const likes = product.likes || []
    const dislikes = product.dislikes || []
    
    let newLikes = [...likes]
    let newDislikes = [...dislikes]

    if (likes.includes(user.id)) {
      newLikes = likes.filter(id => id !== user.id)
    } else {
      newLikes.push(user.id)
      newDislikes = dislikes.filter(id => id !== user.id)
    }

    await blink.db.products.update(productId, {
      likes: JSON.stringify(newLikes),
      dislikes: JSON.stringify(newDislikes)
    })

    return await this.getProduct(productId) as Product
  }

  // Transform database record to Product interface
  private static transformProduct(record: any): Product {
    return {
      id: record.id,
      anonymousId: record.anonymousId || record.anonymous_id,
      name: record.name,
      description: record.description,
      keywords: record.keywords ? JSON.parse(record.keywords) : [],
      price: record.price,
      color: record.color,
      size: record.size,
      shared: record.shared,
      purchased: record.purchased,
      purchasedStatus: record.purchasedStatus || record.purchased_status,
      photo: {
        url: record.photoUrl || record.photo_url,
        small: record.photoSmall || record.photo_small,
        normal: record.photoNormal || record.photo_normal
      },
      photos: record.photos ? JSON.parse(record.photos) : [],
      url: record.url,
      originalUrl: record.originalUrl || record.original_url,
      domain: record.domain,
      ceId: record.ceId || record.ce_id,
      sequence: record.sequence,
      userId: record.userId || record.user_id,
      categoryId: record.categoryId || record.category_id,
      forkId: record.forkId || record.fork_id,
      forkedIds: record.forkedIds ? JSON.parse(record.forkedIds) : record.forked_ids ? JSON.parse(record.forked_ids) : [],
      likes: record.likes ? JSON.parse(record.likes) : [],
      dislikes: record.dislikes ? JSON.parse(record.dislikes) : [],
      addedBy: record.addedBy || record.added_by,
      createdAt: record.createdAt || record.created_at,
      updatedAt: record.updatedAt || record.updated_at
    }
  }
}

// Affiliate Marketing Service
export class AffiliateService {
  static async createAffiliateLink(productId: string, retailerId: string, commissionRate: number = 0.05): Promise<AffiliateLink> {
    const user = await blink.auth.me()
    const affiliateCode = `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const product = await ProductService.getProduct(productId)
    if (!product) {
      throw new Error('Product not found')
    }

    const affiliateUrl = `${product.url}?ref=${affiliateCode}`

    const linkData = {
      id: `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      affiliateCode,
      affiliateUrl,
      commissionRate,
      retailerId,
      userId: user.id,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await blink.db.affiliateLinks.create(linkData)
    return this.transformAffiliateLink(result)
  }

  static async trackClick(affiliateCode: string, trackingData: AffiliateTrackingData): Promise<void> {
    const links = await blink.db.affiliateLinks.list({
      where: { affiliateCode }
    })

    if (links.length > 0) {
      const link = links[0]
      await blink.db.affiliateLinks.update(link.id, {
        clicks: link.clicks + 1,
        updatedAt: new Date().toISOString()
      })

      // Track analytics
      await this.updateRetailerAnalytics(link.retailerId, 'click')
    }
  }

  static async trackConversion(affiliateCode: string, revenue: number): Promise<void> {
    const links = await blink.db.affiliateLinks.list({
      where: { affiliateCode }
    })

    if (links.length > 0) {
      const link = links[0]
      const commission = revenue * link.commissionRate
      
      await blink.db.affiliateLinks.update(link.id, {
        conversions: link.conversions + 1,
        revenue: link.revenue + commission,
        updatedAt: new Date().toISOString()
      })

      // Track analytics
      await this.updateRetailerAnalytics(link.retailerId, 'conversion', revenue)
    }
  }

  private static async updateRetailerAnalytics(retailerId: string, type: 'click' | 'conversion', revenue: number = 0): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    
    const existing = await blink.db.retailerAnalytics.list({
      where: { retailerId, date: today }
    })

    if (existing.length > 0) {
      const analytics = existing[0]
      const updates: any = {}
      
      if (type === 'click') {
        updates.productViews = analytics.productViews + 1
      } else if (type === 'conversion') {
        updates.purchases = analytics.purchases + 1
        updates.revenue = analytics.revenue + revenue
      }

      await blink.db.retailerAnalytics.update(analytics.id, updates)
    } else {
      const analyticsData = {
        id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        retailerId,
        productViews: type === 'click' ? 1 : 0,
        cartAdds: 0,
        purchases: type === 'conversion' ? 1 : 0,
        revenue: type === 'conversion' ? revenue : 0,
        date: today,
        createdAt: new Date().toISOString()
      }

      await blink.db.retailerAnalytics.create(analyticsData)
    }
  }

  private static transformAffiliateLink(record: any): AffiliateLink {
    return {
      id: record.id,
      productId: record.productId || record.product_id,
      affiliateCode: record.affiliateCode || record.affiliate_code,
      affiliateUrl: record.affiliateUrl || record.affiliate_url,
      commissionRate: record.commissionRate || record.commission_rate,
      retailerId: record.retailerId || record.retailer_id,
      userId: record.userId || record.user_id,
      clicks: record.clicks,
      conversions: record.conversions,
      revenue: record.revenue,
      isActive: Number(record.isActive || record.is_active) > 0,
      createdAt: record.createdAt || record.created_at,
      updatedAt: record.updatedAt || record.updated_at
    }
  }
}

// Cart Service
export class CartService {
  static async addToCart(productId: string, quantity: number = 1, cartType: 'shopping' | 'share' | 'sale' = 'shopping', affiliateLinkId?: string): Promise<CartItem> {
    const user = await blink.auth.me()
    
    // Check if item already in cart
    const existing = await blink.db.cartItems.list({
      where: { productId, userId: user.id, cartType }
    })

    if (existing.length > 0) {
      // Update quantity
      const item = existing[0]
      await blink.db.cartItems.update(item.id, {
        quantity: item.quantity + quantity,
        updatedAt: new Date().toISOString()
      })
      return this.transformCartItem(item)
    }

    const cartData = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      quantity,
      userId: user.id,
      cartType,
      affiliateLinkId: affiliateLinkId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await blink.db.cartItems.create(cartData)
    return this.transformCartItem(result)
  }

  static async getCartItems(cartType: 'shopping' | 'share' | 'sale' = 'shopping'): Promise<CartItem[]> {
    try {
      const user = await blink.auth.me()
      
      const items = await blink.db.cartItems.list({
        where: { userId: user.id, cartType },
        orderBy: { createdAt: 'desc' }
      })

      return items.map(item => this.transformCartItem(item))
    } catch (error) {
      console.warn('Database not available, returning demo cart items:', error)
      
      // Return demo cart items when database is not available
      const demoCartItems: CartItem[] = [
        {
          id: 'cart_demo_1',
          productId: 'demo_1',
          quantity: 1,
          userId: 'demo_user',
          cartType: cartType,
          affiliateLinkId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'cart_demo_2',
          productId: 'demo_2',
          quantity: 2,
          userId: 'demo_user',
          cartType: cartType,
          affiliateLinkId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      return demoCartItems
    }
  }

  static async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    await blink.db.cartItems.update(id, {
      quantity,
      updatedAt: new Date().toISOString()
    })

    const items = await blink.db.cartItems.list({ where: { id } })
    return this.transformCartItem(items[0])
  }

  static async removeFromCart(id: string): Promise<void> {
    await blink.db.cartItems.delete(id)
  }

  static async clearCart(cartType: 'shopping' | 'share' | 'sale' = 'shopping'): Promise<void> {
    const user = await blink.auth.me()
    const items = await blink.db.cartItems.list({
      where: { userId: user.id, cartType }
    })

    for (const item of items) {
      await blink.db.cartItems.delete(item.id)
    }
  }

  private static transformCartItem(record: any): CartItem {
    return {
      id: record.id,
      productId: record.productId || record.product_id,
      quantity: record.quantity,
      userId: record.userId || record.user_id,
      cartType: record.cartType || record.cart_type,
      affiliateLinkId: record.affiliateLinkId || record.affiliate_link_id,
      createdAt: record.createdAt || record.created_at,
      updatedAt: record.updatedAt || record.updated_at
    }
  }
}