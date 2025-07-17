import { useState, useEffect } from 'react'
import { ShoppingCart, Share2, Heart, Tag, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AddProductModal } from '@/components/products/AddProductModal'
import { AffiliateTracker } from '@/components/affiliate/AffiliateTracker'
import { StripeConnectSetup } from '@/components/stripe/StripeConnectSetup'
import { ProductService, CartService } from '@/services/productService'
import { StripeService } from '@/services/stripeService'
import type { Product, CartItem as CartItemType } from '@/types'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  store: string
  category: string
  inStock: boolean
}

interface SocialPost {
  id: string
  user: {
    name: string
    avatar: string
  }
  items: CartItem[]
  caption: string
  likes: number
  comments: number
  timestamp: string
}

interface CartHubProps {
  activeCart: string
}

export function CartHub({ activeCart }: CartHubProps) {
  const [activeTab, setActiveTab] = useState(activeCart)
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [showStripeSetup, setShowStripeSetup] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    setActiveTab(activeCart)
  }, [activeCart])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load user's products
      const productsResult = await ProductService.searchProducts({})
      setProducts(productsResult.data)

      // Load cart items
      const cartResult = await CartService.getCartItems('shopping')
      setCartItems(cartResult)

      // Check if we're getting demo data (indicates database issues)
      const isDemoData = productsResult.data.some(p => p.id.startsWith('demo_')) || 
                        cartResult.some(c => c.id.startsWith('cart_demo_'))
      
      setDemoMode(isDemoData)
    } catch (error) {
      console.error('Failed to load data:', error)
      setDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  const handleProductAdded = () => {
    loadData() // Refresh data when new product is added
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await CartService.addToCart(product.id, 1, 'shopping')
      loadData() // Refresh cart
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    }
  }

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      await CartService.removeFromCart(cartItemId)
      loadData() // Refresh cart
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      alert('Failed to remove item from cart. Please try again.')
    }
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) return
    
    try {
      // For demo purposes, we'll use a mock retailer ID
      const mockRetailerId = 'retailer_demo'
      const paymentIntent = await StripeService.createPaymentIntent(cartItems, mockRetailerId)
      
      // In a real implementation, you would redirect to Stripe checkout
      alert(`Payment intent created: ${paymentIntent.id}. In a real app, this would redirect to Stripe checkout.`)
    } catch (error) {
      console.error('Failed to create payment intent:', error)
      alert('Failed to initiate checkout. Please try again.')
    }
  }

  const socialPosts: SocialPost[] = [
    {
      id: '1',
      user: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=40&h=40&fit=crop'
      },
      items: cartItems.slice(0, 1),
      caption: 'Perfect for my morning runs! 🏃‍♀️',
      likes: 24,
      comments: 8,
      timestamp: '2h ago'
    },
    {
      id: '2',
      user: {
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop'
      },
      items: cartItems.slice(1, 2),
      caption: 'Finally found the perfect work setup! 💻',
      likes: 18,
      comments: 5,
      timestamp: '4h ago'
    }
  ]

  const CartItemCard = ({ item, showActions = true }: { item: CartItem; showActions?: boolean }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{item.name}</h4>
            <p className="text-sm text-gray-500">{item.store}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold text-lg">${item.price}</span>
              <Badge variant={item.inStock ? 'default' : 'secondary'}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
          </div>
          {showActions && (
            <div className="flex flex-col space-y-2">
              <Button size="sm" variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const SocialPostCard = ({ post }: { post: SocialPost }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{post.user.name}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm mb-3">{post.caption}</p>
        <div className="space-y-2">
          {post.items.map((item) => (
            <CartItemCard key={item.id} item={item} showActions={false} />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              {post.comments}
            </Button>
          </div>
          <Button size="sm">Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 max-w-2xl mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="shopping" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Shopping</span>
          </TabsTrigger>
          <TabsTrigger value="buying" className="flex items-center space-x-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Buying</span>
          </TabsTrigger>
          <TabsTrigger value="sharing" className="flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Sharing</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Social</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shopping" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Shopping Cart ({cartItems.length})</span>
                <AddProductModal onProductAdded={handleProductAdded} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : demoMode ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <ShoppingCart className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Demo Mode Active</h3>
                    <p className="text-amber-800 mb-4">
                      The database is currently being set up. Below is a preview of how your shopping cart will work:
                    </p>
                  </div>
                  
                  {/* Show demo products and cart items */}
                  {cartItems.map((item) => {
                    const product = products.find(p => p.id === item.productId)
                    if (!product) return null
                    
                    return (
                      <Card key={item.id} className="mb-3 border-amber-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={product.photo.url}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.domain}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                  <Badge variant="secondary">Demo Item</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button size="sm" variant="outline" disabled>
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" disabled>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">
                        Demo Total: ${cartItems.reduce((sum, item) => {
                          const product = products.find(p => p.id === item.productId)
                          return sum + (product ? product.price * item.quantity : 0)
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                      size="lg"
                      disabled
                    >
                      Demo Checkout (Database Setup Required)
                    </Button>
                    <p className="text-xs text-amber-700 mt-3 text-center">
                      Full functionality will be available once the database is ready!
                    </p>
                  </div>
                </div>
              ) : products.length === 0 && cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome to OllaCart!</h3>
                    <p className="text-blue-700 mb-4">
                      Your AI-powered social shopping platform is ready. Start by adding your first product from any online store.
                    </p>
                    <AddProductModal onProductAdded={handleProductAdded} />
                  </div>
                </div>
              ) : cartItems.length > 0 ? (
                <div>
                  {cartItems.map((item) => {
                    const product = products.find(p => p.id === item.productId)
                    if (!product) return null
                    
                    return (
                      <Card key={item.id} className="mb-3">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={product.photo.url}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.domain}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                  <Badge variant="default">In Stock</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAddToCart(product)}
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">
                        Total: ${cartItems.reduce((sum, item) => {
                          const product = products.find(p => p.id === item.productId)
                          return sum + (product ? product.price * item.quantity : 0)
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                      size="lg"
                      onClick={handleCheckout}
                    >
                      Checkout with Stripe
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <AddProductModal onProductAdded={handleProductAdded} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buying" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Buying Cart - Ready for Checkout</span>
                <Badge variant="secondary">{cartItems.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoMode && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-amber-800">
                      <strong>Demo Mode:</strong> This shows how the buying cart will work once the database is ready.
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-600">Items ready for purchase with unified checkout</p>
                {cartItems.length > 0 ? (
                  <div>
                    {cartItems.map((item) => {
                      const product = products.find(p => p.id === item.productId)
                      if (!product) return null
                      
                      return (
                        <Card key={item.id} className="mb-3">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={product.photo.url}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                <p className="text-sm text-gray-500">{product.domain}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                                  <Badge variant="default">Ready to Buy</Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">
                          Total: ${cartItems.reduce((sum, item) => {
                            const product = products.find(p => p.id === item.productId)
                            return sum + (product ? product.price * item.quantity : 0)
                          }, 0).toFixed(2)}
                        </span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" 
                        size="lg"
                        onClick={handleCheckout}
                        disabled={demoMode}
                      >
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        {demoMode ? 'Demo Checkout (Database Setup Required)' : 'Checkout Now'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No items ready for checkout</p>
                    <p className="text-sm text-gray-400 mt-2">Move items from shopping cart when ready to buy</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sharing Cart</span>
                <Button size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Collection
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoMode && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-amber-800">
                      <strong>Demo Mode:</strong> This shows how the sharing cart will work once the database is ready.
                    </p>
                  </div>
                )}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">Share with Friends</h3>
                  <p className="text-sm text-purple-700 mb-3">
                    Items in this cart will appear in your social feed and can be shared via public link
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700" disabled={demoMode}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Generate Share Link
                    </Button>
                    <Button size="sm" variant="outline" disabled={demoMode}>
                      Post to Feed
                    </Button>
                  </div>
                </div>
                
                {cartItems.length > 0 ? (
                  cartItems.map((item) => {
                    const product = products.find(p => p.id === item.productId)
                    if (!product) return null
                    
                    return (
                      <Card key={item.id} className="mb-3">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={product.photo.url}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.domain}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                                <Badge variant="secondary">Shareable</Badge>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <Share2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No items to share</p>
                    <p className="text-sm text-gray-400 mt-2">Add items to share with friends and get feedback</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Social Shopping Feed</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
            {socialPosts.map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>


      </Tabs>
    </div>
  )
}