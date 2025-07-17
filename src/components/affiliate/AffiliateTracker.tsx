import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, Users, DollarSign, MousePointer, ExternalLink, Copy, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AffiliateService } from '@/services/productService'
import type { AffiliateLink, Product } from '@/types'

interface AffiliateTrackerProps {
  products: Product[]
}

export function AffiliateTracker({ products }: AffiliateTrackerProps) {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    loadAffiliateLinks()
  }, [loadAffiliateLinks])

  const loadAffiliateLinks = useCallback(async () => {
    setLoading(true)
    try {
      // In a real implementation, you would fetch affiliate links from the API
      // For now, we'll use mock data
      const mockLinks: AffiliateLink[] = products.slice(0, 3).map((product, index) => ({
        id: `aff_${product.id}`,
        productId: product.id,
        affiliateCode: `AFF${Date.now()}${index}`,
        affiliateUrl: `${product.url}?ref=AFF${Date.now()}${index}`,
        commissionRate: 0.05,
        retailerId: `retailer_${index + 1}`,
        userId: 'current_user',
        clicks: Math.floor(Math.random() * 100),
        conversions: Math.floor(Math.random() * 10),
        revenue: Math.random() * 500,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      
      setAffiliateLinks(mockLinks)
    } catch (error) {
      console.error('Failed to load affiliate links:', error)
    } finally {
      setLoading(false)
    }
  }, [products])

  const createAffiliateLink = async (product: Product) => {
    try {
      const newLink = await AffiliateService.createAffiliateLink(
        product.id,
        `retailer_${Date.now()}`,
        0.05
      )
      
      setAffiliateLinks(prev => [...prev, newLink])
      setSelectedProduct(null)
    } catch (error) {
      console.error('Failed to create affiliate link:', error)
      alert('Failed to create affiliate link. Please try again.')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0)
  const totalConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0)
  const totalRevenue = affiliateLinks.reduce((sum, link) => sum + link.revenue, 0)
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MousePointer className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold">{totalConversions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="links" className="w-full">
        <TabsList>
          <TabsTrigger value="links">Affiliate Links</TabsTrigger>
          <TabsTrigger value="products">Available Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Affiliate Links</CardTitle>
            </CardHeader>
            <CardContent>
              {affiliateLinks.length === 0 ? (
                <div className="text-center py-8">
                  <ExternalLink className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No affiliate links created yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Create affiliate links for your products to start earning commissions
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Affiliate Code</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliateLinks.map((link) => {
                      const product = products.find(p => p.id === link.productId)
                      const conversionRate = link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0
                      
                      return (
                        <TableRow key={link.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {product && (
                                <img
                                  src={product.photo.url}
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium">{product?.name || 'Unknown Product'}</p>
                                <p className="text-sm text-gray-500">${product?.price.toFixed(2)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                {link.affiliateCode}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(link.affiliateCode)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {(link.commissionRate * 100).toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>{link.clicks.toLocaleString()}</TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{link.conversions}</span>
                              <span className="text-sm text-gray-500 ml-1">
                                ({conversionRate.toFixed(1)}%)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${link.revenue.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(link.affiliateUrl)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(link.affiliateUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Affiliate Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.filter(product => 
                  !affiliateLinks.some(link => link.productId === product.id)
                ).map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={product.photo.url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{product.name}</h4>
                          <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">5% Commission</Badge>
                        <Button
                          size="sm"
                          onClick={() => createAffiliateLink(product)}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                          Create Link
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {products.filter(product => 
                !affiliateLinks.some(link => link.productId === product.id)
              ).length === 0 && (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">All products have affiliate links</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add more products to create additional affiliate links
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Click-through Rate</span>
                    <span>{conversionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={conversionRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Revenue Goal</span>
                    <span>${totalRevenue.toFixed(0)} / $1,000</span>
                  </div>
                  <Progress value={(totalRevenue / 1000) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Active Links</span>
                    <span>{affiliateLinks.filter(link => link.isActive).length} / {affiliateLinks.length}</span>
                  </div>
                  <Progress 
                    value={affiliateLinks.length > 0 ? (affiliateLinks.filter(link => link.isActive).length / affiliateLinks.length) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {affiliateLinks
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5)
                    .map((link) => {
                      const product = products.find(p => p.id === link.productId)
                      return (
                        <div key={link.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {product && (
                              <img
                                src={product.photo.url}
                                alt={product.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-sm">{product?.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{link.clicks} clicks</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">${link.revenue.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">{link.conversions} sales</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}