import { BarChart3, TrendingUp, Users, DollarSign, Package, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AnalyticsToolbar() {
  const analyticsItems = [
    { icon: BarChart3, label: 'Overview', value: '2.4K', change: '+12%' },
    { icon: TrendingUp, label: 'Sales', value: '$12.5K', change: '+8%' },
    { icon: Users, label: 'Customers', value: '1.2K', change: '+15%' },
    { icon: Package, label: 'Products', value: '456', change: '+3%' },
    { icon: Target, label: 'Conversion', value: '3.2%', change: '+0.5%' },
    { icon: DollarSign, label: 'Revenue', value: '$45.2K', change: '+22%' }
  ]

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
        
        <div className="space-y-3">
          {analyticsItems.map((item, index) => (
            <Card key={index} className="p-3">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <item.icon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.value}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-600">{item.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Quick Actions</h3>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Full Analytics
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <TrendingUp className="h-4 w-4 mr-2" />
          Sales Report
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Users className="h-4 w-4 mr-2" />
          Customer Insights
        </Button>
      </div>
    </div>
  )
}