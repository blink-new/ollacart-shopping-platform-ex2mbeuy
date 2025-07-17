import { useState } from 'react'
import { ShoppingCart, Share2, Heart, Tag, Bell, User, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface CartHeaderProps {
  user: any
  onSignOut: () => void
  cartCounts: {
    shopping: number
    buying: number
    sharing: number
    social: number
  }
  activeCart: string
  onCartChange: (cart: string) => void
}

export function CartHeader({ user, onSignOut, cartCounts, activeCart, onCartChange }: CartHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  const cartTypes = [
    {
      id: 'shopping',
      label: 'Shopping Cart',
      icon: ShoppingCart,
      count: cartCounts.shopping,
      color: 'bg-blue-500',
      description: 'Items you\'re considering'
    },
    {
      id: 'buying',
      label: 'Buying Cart',
      icon: ShoppingBag,
      count: cartCounts.buying,
      color: 'bg-green-500',
      description: 'Ready for checkout'
    },
    {
      id: 'sharing',
      label: 'Sharing Cart',
      icon: Share2,
      count: cartCounts.sharing,
      color: 'bg-purple-500',
      description: 'Share with friends'
    },
    {
      id: 'social',
      label: 'Social Feed',
      icon: Heart,
      count: cartCounts.social,
      color: 'bg-pink-500',
      description: 'Friends\' recommendations'
    }
  ]

  const notifications = [
    {
      id: '1',
      type: 'price_drop',
      message: 'Price dropped on Wireless Headphones',
      time: '2m ago',
      unread: true
    },
    {
      id: '2',
      type: 'friend_activity',
      message: 'Sarah added 3 items to her sharing cart',
      time: '1h ago',
      unread: true
    },
    {
      id: '3',
      type: 'recommendation',
      message: 'AI found perfect matches for your style',
      time: '3h ago',
      unread: false
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">OllaCart</h1>
            </div>
            <span className="text-sm text-gray-500">AI-Powered Social Shopping</span>
          </div>

          {/* Cart Navigation */}
          <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
            {cartTypes.map((cart) => {
              const Icon = cart.icon
              const isActive = activeCart === cart.id
              
              return (
                <Popover key={cart.id}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`relative flex items-center space-x-2 px-3 py-2 ${
                        isActive 
                          ? 'bg-white shadow-sm border' 
                          : 'hover:bg-white/50'
                      }`}
                      onClick={() => onCartChange(cart.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm font-medium">{cart.label}</span>
                      {cart.count > 0 && (
                        <Badge 
                          variant="secondary" 
                          className={`${cart.color} text-white text-xs min-w-[20px] h-5 flex items-center justify-center`}
                        >
                          {cart.count > 99 ? '99+' : cart.count}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3" align="center">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded ${cart.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="font-medium">{cart.label}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{cart.description}</p>
                      <div className="text-sm">
                        <span className="font-medium">{cart.count}</span> items
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b hover:bg-gray-50 ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user?.displayName || user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={onSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}