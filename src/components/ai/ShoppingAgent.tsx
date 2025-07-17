import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, ShoppingBag, Zap, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
  products?: Array<{
    name: string
    price: number
    image: string
    store: string
  }>
}

interface QuickAction {
  icon: any
  label: string
  description: string
  action: string
}

export function ShoppingAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI shopping assistant. I can help you find the perfect outfits, discover deals, and make smart shopping decisions. What are you looking for today?",
      timestamp: new Date(),
      suggestions: ['Find summer outfits', 'Show me deals', 'Help with work attire', 'Gift ideas']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions: QuickAction[] = [
    {
      icon: Sparkles,
      label: 'Outfit Builder',
      description: 'Create complete outfits',
      action: 'help me build an outfit for'
    },
    {
      icon: Zap,
      label: 'Deal Finder',
      description: 'Find the best deals',
      action: 'find deals on'
    },
    {
      icon: TrendingUp,
      label: 'Trending Items',
      description: 'What\'s popular now',
      action: 'show me trending items'
    },
    {
      icon: ShoppingBag,
      label: 'Smart Recommendations',
      description: 'Personalized suggestions',
      action: 'recommend items based on my style'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(content),
        timestamp: new Date(),
        suggestions: generateSuggestions(content),
        products: content.toLowerCase().includes('outfit') || content.toLowerCase().includes('clothes') 
          ? generateProductSuggestions() 
          : undefined
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('outfit') || input.includes('clothes')) {
      return "I'd love to help you build the perfect outfit! Based on current trends and your style preferences, I've found some great pieces that work well together. What's the occasion you're shopping for?"
    }
    
    if (input.includes('deal') || input.includes('sale')) {
      return "Great timing! I've found some amazing deals across multiple stores. Here are the best discounts available right now. Would you like me to set up price alerts for specific items?"
    }
    
    if (input.includes('trending') || input.includes('popular')) {
      return "Here are the hottest items everyone's talking about right now! These pieces are flying off the shelves and getting great reviews from other shoppers."
    }
    
    return "I understand you're looking for something specific. Let me search across all connected stores to find the best options for you. Can you tell me more about your preferences?"
  }

  const generateSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase()
    
    if (input.includes('outfit')) {
      return ['Show casual outfits', 'Find formal wear', 'Summer collection', 'Add accessories']
    }
    
    if (input.includes('deal')) {
      return ['Electronics deals', 'Fashion sales', 'Set price alerts', 'Compare prices']
    }
    
    return ['Find similar items', 'Check other stores', 'Save to wishlist', 'Share with friends']
  }

  const generateProductSuggestions = () => [
    {
      name: 'Classic White Shirt',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop',
      store: 'FashionHub'
    },
    {
      name: 'Denim Jacket',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
      store: 'StyleStore'
    }
  ]

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AI Shopping Assistant</h2>
            <p className="text-xs text-gray-500">Always here to help</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-auto p-3 flex flex-col items-center text-center"
              onClick={() => handleQuickAction(action.action)}
            >
              <action.icon className="h-4 w-4 mb-1" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">AI Assistant</span>
                  </div>
                )}
                
                <div className={`rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>

                {message.products && (
                  <div className="mt-3 space-y-2">
                    {message.products.map((product, index) => (
                      <Card key={index} className="p-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.store}</p>
                            <p className="text-xs font-semibold">${product.price}</p>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs">
                            Add
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 text-xs"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about shopping..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}