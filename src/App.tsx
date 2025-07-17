import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { LandingPage } from './components/landing/LandingPage'
import { RetailerDashboard } from './components/retailer/RetailerDashboard'
import { CartHeader } from './components/layout/CartHeader'
import { AnalyticsToolbar } from './components/layout/AnalyticsToolbar'
import { CartHub } from './components/shopping/CartHub'
import { ShoppingAgent } from './components/ai/ShoppingAgent'
import { Button } from './components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Sparkles } from 'lucide-react'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showLanding, setShowLanding] = useState(true)
  const [userType, setUserType] = useState<'customer' | 'retailer'>('customer')
  const [activeCart, setActiveCart] = useState('shopping')
  
  // Mock cart counts - in real app, these would come from database
  const [cartCounts, setCartCounts] = useState({
    shopping: 3,
    buying: 1,
    sharing: 2,
    social: 8
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // If user is authenticated, hide landing page
      if (state.user && !state.isLoading) {
        setShowLanding(false)
      }
    })
    return unsubscribe
  }, [])

  const handleSignOut = () => {
    blink.auth.logout()
    setShowLanding(true)
    setUserType('customer')
  }

  const handleGetStarted = () => {
    blink.auth.login()
  }

  const handleUserTypeSelect = (type: 'customer' | 'retailer') => {
    setUserType(type)
    blink.auth.login()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading OllaCart...</p>
        </div>
      </div>
    )
  }

  // Show landing page if not authenticated or explicitly showing landing
  if (!user || showLanding) {
    return (
      <div className="min-h-screen">
        <LandingPage onGetStarted={handleGetStarted} />
        
        {/* User Type Selection Modal - shown when user clicks get started */}
        {!user && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ display: 'none' }}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-center mb-6">Choose Your Experience</h2>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => handleUserTypeSelect('customer')}
                  className="w-full h-16 text-left flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <div className="p-3 bg-white/20 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">I'm a Shopper</div>
                    <div className="text-sm text-white/80">Discover, compare, and buy products</div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => handleUserTypeSelect('retailer')}
                  className="w-full h-16 text-left flex items-center space-x-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">I'm a Retailer</div>
                    <div className="text-sm text-white/80">Sell products and view analytics</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Show retailer dashboard for retailers
  if (userType === 'retailer') {
    return <RetailerDashboard user={user} onSignOut={handleSignOut} />
  }

  // Show customer dashboard
  return (
    <div className="min-h-screen bg-background">
      <CartHeader 
        user={user} 
        onSignOut={handleSignOut}
        cartCounts={cartCounts}
        activeCart={activeCart}
        onCartChange={setActiveCart}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <AnalyticsToolbar />
        <CartHub activeCart={activeCart} />
        <ShoppingAgent />
      </div>
    </div>
  )
}

export default App