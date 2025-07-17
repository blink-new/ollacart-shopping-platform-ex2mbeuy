import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Package, Target, ShoppingBag, Eye, MousePointer, CreditCard, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface RetailerDashboardProps {
  user: any
  onSignOut: () => void
}

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    conversionRate: number
    revenueChange: number
    ordersChange: number
    customersChange: number
    conversionChange: number
  }
  products: Array<{
    id: string
    name: string
    image: string
    views: number
    addToCarts: number
    purchases: number
    revenue: number
    conversionRate: number
    trend: 'up' | 'down' | 'stable'
  }>
  customers: Array<{
    id: string
    name: string
    email: string
    avatar: string
    totalSpent: number
    orderCount: number
    lastOrder: string
    status: 'active' | 'inactive'
  }>
  sales: Array<{
    date: string
    revenue: number
    orders: number
  }>
  topCategories: Array<{
    name: string
    revenue: number
    percentage: number
  }>
}

export function RetailerDashboard({ user, onSignOut }: RetailerDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalytics({
        overview: {
          totalRevenue: 45280,
          totalOrders: 1247,
          totalCustomers: 892,
          conversionRate: 3.2,
          revenueChange: 22.5,
          ordersChange: 15.3,
          customersChange: 8.7,
          conversionChange: 0.5
        },
        products: [
          {
            id: '1',
            name: 'Wireless Bluetooth Headphones',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            views: 2847,
            addToCarts: 342,
            purchases: 89,
            revenue: 7120,
            conversionRate: 3.1,
            trend: 'up'
          },
          {
            id: '2',
            name: 'Smart Fitness Watch',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
            views: 1923,
            addToCarts: 287,
            purchases: 67,
            revenue: 13400,
            conversionRate: 3.5,
            trend: 'up'
          },
          {
            id: '3',
            name: 'Portable Phone Charger',
            image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop',
            views: 1456,
            addToCarts: 198,
            purchases: 45,
            revenue: 1350,
            conversionRate: 3.1,
            trend: 'stable'
          },
          {
            id: '4',
            name: 'Laptop Stand Adjustable',
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
            views: 987,
            addToCarts: 134,
            purchases: 32,
            revenue: 1920,
            conversionRate: 3.2,
            trend: 'down'
          }
        ],
        customers: [
          {
            id: '1',
            name: 'Sarah Chen',
            email: 'sarah.chen@email.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=40&h=40&fit=crop',
            totalSpent: 1247.50,
            orderCount: 8,
            lastOrder: '2024-01-15',
            status: 'active'
          },
          {
            id: '2',
            name: 'Mike Rodriguez',
            email: 'mike.rodriguez@email.com',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
            totalSpent: 892.30,
            orderCount: 5,
            lastOrder: '2024-01-12',
            status: 'active'
          },
          {
            id: '3',
            name: 'Emma Thompson',
            email: 'emma.thompson@email.com',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
            totalSpent: 567.80,
            orderCount: 3,
            lastOrder: '2024-01-08',
            status: 'inactive'
          }
        ],
        sales: [
          { date: '2024-01-01', revenue: 1200, orders: 15 },
          { date: '2024-01-02', revenue: 1450, orders: 18 },
          { date: '2024-01-03', revenue: 1100, orders: 12 },
          { date: '2024-01-04', revenue: 1680, orders: 22 },
          { date: '2024-01-05', revenue: 1890, orders: 25 },
          { date: '2024-01-06', revenue: 2100, orders: 28 },
          { date: '2024-01-07', revenue: 1750, orders: 21 }
        ],
        topCategories: [
          { name: 'Electronics', revenue: 18500, percentage: 41 },
          { name: 'Fashion', revenue: 12300, percentage: 27 },
          { name: 'Home & Garden', revenue: 8900, percentage: 20 },
          { name: 'Sports', revenue: 5580, percentage: 12 }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading retailer dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">OllaCart</h1>
              </div>
              <Badge variant="secondary">Retailer Portal</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.displayName || user?.email}</span>
              <Button variant="outline" size="sm" onClick={onSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{analytics.overview.revenueChange}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(analytics.overview.totalOrders)}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{analytics.overview.ordersChange}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(analytics.overview.totalCustomers)}</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{analytics.overview.customersChange}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.conversionRate}%</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{analytics.overview.conversionChange}% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-500">{formatCurrency(category.revenue)}</span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span>{formatNumber(product.views)} views</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MousePointer className="h-4 w-4 text-gray-400" />
                            <span>{formatNumber(product.addToCarts)} adds</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <span>{formatNumber(product.purchases)} sales</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span>{formatCurrency(product.revenue)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(product.trend)}
                            <span>{product.conversionRate}% conv.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={customer.avatar} 
                          alt={customer.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{customer.name}</h3>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{formatCurrency(customer.totalSpent)}</div>
                        <div className="text-sm text-gray-500">{customer.orderCount} orders</div>
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(analytics.sales.reduce((sum, day) => sum + day.revenue, 0))}
                      </div>
                      <div className="text-sm text-blue-800">7-Day Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.sales.reduce((sum, day) => sum + day.orders, 0)}
                      </div>
                      <div className="text-sm text-green-800">7-Day Orders</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(analytics.sales.reduce((sum, day) => sum + day.revenue, 0) / analytics.sales.reduce((sum, day) => sum + day.orders, 0))}
                      </div>
                      <div className="text-sm text-purple-800">Avg. Order Value</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {analytics.sales.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">{day.orders} orders</span>
                          <span className="font-semibold">{formatCurrency(day.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}