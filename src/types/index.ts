export interface User {
  id: string
  email: string
  displayName?: string
  avatar?: string
}

// Enhanced Product interface based on OllaCart model
export interface Product {
  id: string
  anonymousId?: string
  name: string
  description?: string
  keywords?: string[]
  price: number
  color?: string
  size?: string
  shared: number
  purchased: number
  purchasedStatus: number
  photo: {
    url: string
    small?: string
    normal?: string
  }
  photos?: Array<{
    url: string
    small?: string
    normal?: string
  }>
  url: string
  originalUrl: string
  domain: string
  ceId?: string
  sequence: number
  userId: string
  categoryId?: string
  forkId?: string
  forkedIds?: string[]
  likes?: string[]
  dislikes?: string[]
  addedBy?: string
  createdAt: string
  updatedAt: string
}

// Affiliate Marketing Types
export interface AffiliateLink {
  id: string
  productId: string
  affiliateCode: string
  affiliateUrl: string
  commissionRate: number
  retailerId: string
  userId: string
  clicks: number
  conversions: number
  revenue: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Retailer {
  id: string
  name: string
  email: string
  domain: string
  stripeAccountId?: string
  stripeOnboardingComplete: boolean
  commissionRate: number
  userId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  userId: string
  cartType: 'shopping' | 'share' | 'sale'
  affiliateLinkId?: string
  createdAt: string
  updatedAt: string
  product?: Product
  affiliateLink?: AffiliateLink
}

export interface Collection {
  id: string
  name: string
  description: string
  isPublic: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CollectionItem {
  id: string
  collectionId: string
  productId: string
  createdAt: string
  product?: Product
}

export interface SocialPost {
  id: string
  userId: string
  content: string
  productIds: string[]
  likes: number
  shares: number
  createdAt: string
  products?: Product[]
  user?: User
}

export interface RetailerAnalytics {
  id: string
  retailerId: string
  productViews: number
  cartAdds: number
  purchases: number
  revenue: number
  date: string
  createdAt: string
}

export interface Discount {
  id: string
  code: string
  percentage: number
  retailerId: string
  isActive: boolean
  expiresAt: string
  createdAt: string
}

export interface StripePayment {
  id: string
  stripePaymentIntentId: string
  userId: string
  retailerId: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'canceled'
  cartItems: string[]
  affiliateCommission: number
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ProductCreateRequest {
  name: string
  description?: string
  price: number
  photo: string
  photos?: string[]
  url: string
  originalUrl: string
  color?: string
  size?: string
  ceId?: string
  keywords?: string[]
}

export interface ProductUpdateRequest {
  name?: string
  description?: string
  price?: number
  color?: string
  size?: string
  keywords?: string[]
  purchased?: number
  shared?: number
  categoryId?: string
  photo?: {
    url: string
    small?: string
    normal?: string
  }
  photos?: Array<{
    url: string
    small?: string
    normal?: string
  }>
}

export interface ProductSearchRequest {
  limit?: number
  skip?: number
  purchased?: boolean
  shared?: boolean
  social?: boolean
  _id?: string
  _ids?: string[]
}

export interface AffiliateTrackingData {
  productId: string
  affiliateCode: string
  clickSource: string
  userAgent?: string
  referrer?: string
}

export interface StripeConnectAccount {
  accountId: string
  onboardingComplete: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  requirements?: {
    currently_due: string[]
    eventually_due: string[]
    past_due: string[]
  }
}