import { blink } from '@/blink/client'
import type { 
  Retailer, 
  StripePayment, 
  CartItem, 
  StripeConnectAccount 
} from '@/types'

export class StripeService {
  // Retailer onboarding for Stripe Connect
  static async createRetailer(name: string, email: string, domain: string): Promise<Retailer> {
    const user = await blink.auth.me()
    
    const retailerData = {
      id: `retailer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      domain,
      stripeAccountId: '',
      stripeOnboardingComplete: false,
      commissionRate: 0.05, // 5% default commission
      userId: user.id,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await blink.db.retailers.create(retailerData)
    
    // Create Stripe Connect account
    try {
      const stripeAccount = await this.createStripeConnectAccount(result.id, email)
      await blink.db.retailers.update(result.id, {
        stripeAccountId: stripeAccount.accountId,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to create Stripe account:', error)
    }

    return this.transformRetailer(result)
  }

  static async createStripeConnectAccount(retailerId: string, email: string): Promise<StripeConnectAccount> {
    // This would typically call Stripe API to create a Connect account
    // For now, we'll simulate the response
    const accountId = `acct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // In a real implementation, you would:
    // 1. Call Stripe API to create account
    // 2. Store account ID in database
    // 3. Generate onboarding link
    
    return {
      accountId,
      onboardingComplete: false,
      chargesEnabled: false,
      payoutsEnabled: false,
      requirements: {
        currently_due: ['business_type', 'business_profile.url'],
        eventually_due: ['business_profile.mcc'],
        past_due: []
      }
    }
  }

  static async getOnboardingLink(retailerId: string): Promise<string> {
    const retailers = await blink.db.retailers.list({ where: { id: retailerId } })
    
    if (retailers.length === 0) {
      throw new Error('Retailer not found')
    }

    const retailer = retailers[0]
    
    if (!retailer.stripeAccountId) {
      throw new Error('Stripe account not created')
    }

    // In a real implementation, you would call Stripe API:
    // const link = await stripe.accountLinks.create({
    //   account: retailer.stripeAccountId,
    //   refresh_url: `${window.location.origin}/retailer/onboarding/refresh`,
    //   return_url: `${window.location.origin}/retailer/onboarding/complete`,
    //   type: 'account_onboarding',
    // })
    
    // For now, return a mock URL
    return `https://connect.stripe.com/setup/s/${retailer.stripeAccountId}`
  }

  static async updateOnboardingStatus(retailerId: string, complete: boolean): Promise<void> {
    await blink.db.retailers.update(retailerId, {
      stripeOnboardingComplete: complete,
      updatedAt: new Date().toISOString()
    })
  }

  // Unified checkout process
  static async createPaymentIntent(cartItems: CartItem[], retailerId: string): Promise<StripePayment> {
    const user = await blink.auth.me()
    const retailers = await blink.db.retailers.list({ where: { id: retailerId } })
    
    if (retailers.length === 0) {
      throw new Error('Retailer not found')
    }

    const retailer = this.transformRetailer(retailers[0])
    
    if (!retailer.stripeOnboardingComplete) {
      throw new Error('Retailer onboarding not complete')
    }

    // Calculate total amount and affiliate commission
    let totalAmount = 0
    let affiliateCommission = 0

    for (const item of cartItems) {
      // In a real implementation, you would fetch product details
      // For now, we'll use mock pricing
      const itemTotal = 29.99 * item.quantity // Mock price
      totalAmount += itemTotal

      if (item.affiliateLinkId) {
        // Calculate affiliate commission
        affiliateCommission += itemTotal * retailer.commissionRate
      }
    }

    // Create payment record
    const paymentData = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stripePaymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      retailerId,
      amount: totalAmount,
      currency: 'usd',
      status: 'pending' as const,
      cartItems: JSON.stringify(cartItems.map(item => item.id)),
      affiliateCommission,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await blink.db.stripePayments.create(paymentData)

    // In a real implementation, you would create Stripe PaymentIntent:
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(totalAmount * 100), // Convert to cents
    //   currency: 'usd',
    //   application_fee_amount: Math.round(affiliateCommission * 100),
    //   transfer_data: {
    //     destination: retailer.stripeAccountId,
    //   },
    //   metadata: {
    //     paymentId: result.id,
    //     retailerId,
    //     userId: user.id
    //   }
    // })

    return this.transformStripePayment(result)
  }

  static async confirmPayment(paymentId: string): Promise<StripePayment> {
    await blink.db.stripePayments.update(paymentId, {
      status: 'succeeded',
      updatedAt: new Date().toISOString()
    })

    const payments = await blink.db.stripePayments.list({ where: { id: paymentId } })
    const payment = this.transformStripePayment(payments[0])

    // Update affiliate conversions
    const cartItemIds = JSON.parse(payments[0].cartItems || '[]')
    for (const itemId of cartItemIds) {
      const items = await blink.db.cartItems.list({ where: { id: itemId } })
      if (items.length > 0 && items[0].affiliateLinkId) {
        // Track conversion in affiliate system
        const affiliateLinks = await blink.db.affiliateLinks.list({
          where: { id: items[0].affiliateLinkId }
        })
        
        if (affiliateLinks.length > 0) {
          const link = affiliateLinks[0]
          await blink.db.affiliateLinks.update(link.id, {
            conversions: link.conversions + 1,
            revenue: link.revenue + (payment.amount * link.commissionRate),
            updatedAt: new Date().toISOString()
          })
        }
      }
    }

    return payment
  }

  static async getRetailerPayments(retailerId: string): Promise<StripePayment[]> {
    const payments = await blink.db.stripePayments.list({
      where: { retailerId },
      orderBy: { createdAt: 'desc' }
    })

    return payments.map(payment => this.transformStripePayment(payment))
  }

  static async getRetailerAnalytics(retailerId: string, days: number = 30): Promise<any> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const analytics = await blink.db.retailerAnalytics.list({
      where: { 
        retailerId,
        date: { gte: startDate.toISOString().split('T')[0] }
      },
      orderBy: { date: 'desc' }
    })

    const totalRevenue = analytics.reduce((sum, record) => sum + record.revenue, 0)
    const totalViews = analytics.reduce((sum, record) => sum + record.productViews, 0)
    const totalPurchases = analytics.reduce((sum, record) => sum + record.purchases, 0)
    const conversionRate = totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0

    return {
      totalRevenue,
      totalViews,
      totalPurchases,
      conversionRate,
      dailyData: analytics.map(record => ({
        date: record.date,
        revenue: record.revenue,
        views: record.productViews,
        purchases: record.purchases
      }))
    }
  }

  // Transform database records
  private static transformRetailer(record: any): Retailer {
    return {
      id: record.id,
      name: record.name,
      email: record.email,
      domain: record.domain,
      stripeAccountId: record.stripeAccountId || record.stripe_account_id,
      stripeOnboardingComplete: Number(record.stripeOnboardingComplete || record.stripe_onboarding_complete) > 0,
      commissionRate: record.commissionRate || record.commission_rate,
      userId: record.userId || record.user_id,
      isActive: Number(record.isActive || record.is_active) > 0,
      createdAt: record.createdAt || record.created_at,
      updatedAt: record.updatedAt || record.updated_at
    }
  }

  private static transformStripePayment(record: any): StripePayment {
    return {
      id: record.id,
      stripePaymentIntentId: record.stripePaymentIntentId || record.stripe_payment_intent_id,
      userId: record.userId || record.user_id,
      retailerId: record.retailerId || record.retailer_id,
      amount: record.amount,
      currency: record.currency,
      status: record.status,
      cartItems: record.cartItems ? JSON.parse(record.cartItems) : JSON.parse(record.cart_items || '[]'),
      affiliateCommission: record.affiliateCommission || record.affiliate_commission,
      createdAt: record.createdAt || record.created_at,
      updatedAt: record.updatedAt || record.updated_at
    }
  }
}

// Webhook handler for Stripe events
export class StripeWebhookService {
  static async handleWebhook(event: any): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object)
        break
      case 'account.updated':
        await this.handleAccountUpdated(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  }

  private static async handlePaymentSucceeded(paymentIntent: any): Promise<void> {
    const paymentId = paymentIntent.metadata?.paymentId
    
    if (paymentId) {
      await StripeService.confirmPayment(paymentId)
    }
  }

  private static async handleAccountUpdated(account: any): Promise<void> {
    const retailers = await blink.db.retailers.list({
      where: { stripeAccountId: account.id }
    })

    if (retailers.length > 0) {
      const retailer = retailers[0]
      const onboardingComplete = account.charges_enabled && account.payouts_enabled

      await blink.db.retailers.update(retailer.id, {
        stripeOnboardingComplete: onboardingComplete,
        updatedAt: new Date().toISOString()
      })
    }
  }

  private static async handlePaymentFailed(paymentIntent: any): Promise<void> {
    const paymentId = paymentIntent.metadata?.paymentId
    
    if (paymentId) {
      await blink.db.stripePayments.update(paymentId, {
        status: 'failed',
        updatedAt: new Date().toISOString()
      })
    }
  }
}