import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Header } from './components/layout/Header'
import { AnalyticsToolbar } from './components/layout/AnalyticsToolbar'
import { CartHub } from './components/shopping/CartHub'
import { ShoppingAgent } from './components/ai/ShoppingAgent'
import { Button } from './components/ui/button'
import { ShoppingBag, Sparkles } from 'lucide-react'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleSignOut = () => {
    blink.auth.logout()
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OllaCart
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">AI-Powered Social Shopping</p>
            <p className="text-gray-500">
              Shop from any store, get AI recommendations, and share with friends
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <Sparkles className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-indigo-900">AI Shopping Agent</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-amber-900">Multi-Store Cart</p>
                </div>
              </div>

              <Button 
                onClick={() => blink.auth.login()} 
                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Get Started with OllaCart
              </Button>

              <p className="text-xs text-center text-gray-500">
                Join thousands of smart shoppers using AI to find the best deals
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignOut={handleSignOut} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <AnalyticsToolbar />
        <CartHub />
        <ShoppingAgent />
      </div>
    </div>
  )
}

export default App