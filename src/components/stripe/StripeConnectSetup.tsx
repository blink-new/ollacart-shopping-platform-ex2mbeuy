import { useState, useEffect } from 'react'
import { CreditCard, Store, TrendingUp, DollarSign, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StripeService } from '@/services/stripeService'
import type { Retailer } from '@/types'

interface StripeConnectSetupProps {
  onSetupComplete?: (retailer: Retailer) => void
}

export function StripeConnectSetup({ onSetupComplete }: StripeConnectSetupProps) {
  const [step, setStep] = useState<'form' | 'onboarding' | 'complete'>('form')
  const [loading, setLoading] = useState(false)
  const [retailer, setRetailer] = useState<Retailer | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    domain: ''
  })

  const handleCreateRetailer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newRetailer = await StripeService.createRetailer(
        formData.name,
        formData.email,
        formData.domain
      )
      
      setRetailer(newRetailer)
      setStep('onboarding')
    } catch (error) {
      console.error('Failed to create retailer:', error)
      alert('Failed to create retailer account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStartOnboarding = async () => {
    if (!retailer) return

    setLoading(true)
    try {
      const onboardingUrl = await StripeService.getOnboardingLink(retailer.id)
      window.open(onboardingUrl, '_blank')
      
      // Poll for completion (in a real app, you'd use webhooks)
      const pollInterval = setInterval(async () => {
        // Check if onboarding is complete
        // This would typically be done via webhook
        setTimeout(() => {
          setStep('complete')
          onSetupComplete?.(retailer)
          clearInterval(pollInterval)
        }, 5000) // Mock completion after 5 seconds
      }, 2000)
    } catch (error) {
      console.error('Failed to start onboarding:', error)
      alert('Failed to start onboarding. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'complete') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Stripe Connect Setup Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your retailer account has been successfully connected to Stripe. You can now:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium">Accept Payments</h3>
                <p className="text-sm text-gray-600">Process customer payments securely</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium">Track Analytics</h3>
                <p className="text-sm text-gray-600">Monitor sales and performance</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium">Manage Payouts</h3>
                <p className="text-sm text-gray-600">Receive automatic payouts</p>
              </div>
            </div>

            {retailer && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Retailer Details</h4>
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business Name:</span>
                    <span className="font-medium">{retailer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{retailer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domain:</span>
                    <span className="font-medium">{retailer.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission Rate:</span>
                    <span className="font-medium">{(retailer.commissionRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'onboarding') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Store className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Complete Stripe Onboarding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Complete your Stripe Connect onboarding to start accepting payments through OllaCart.
            </p>

            <div className="mb-6">
              <Progress value={50} className="mb-2" />
              <p className="text-sm text-gray-500">Step 2 of 3: Stripe Account Setup</p>
            </div>

            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You'll be redirected to Stripe to complete your account setup. This includes verifying your business information and bank account details.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Button
                onClick={handleStartOnboarding}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {loading ? 'Opening Stripe...' : (
                  <>
                    Continue with Stripe
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500">
                By continuing, you agree to Stripe's Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Store className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Setup Stripe Connect</CardTitle>
        <p className="text-gray-600">
          Connect your business to Stripe to start accepting payments through OllaCart's unified checkout
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateRetailer} className="space-y-6">
          <div className="mb-6">
            <Progress value={25} className="mb-2" />
            <p className="text-sm text-gray-500">Step 1 of 3: Business Information</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                placeholder="Your Business Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="business@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="domain">Business Website</Label>
              <Input
                id="domain"
                type="url"
                placeholder="https://yourbusiness.com"
                value={formData.domain}
                onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Unified checkout experience for customers</li>
              <li>• Automatic payment processing and payouts</li>
              <li>• Detailed analytics and reporting</li>
              <li>• Affiliate marketing integration</li>
              <li>• 5% commission rate on affiliate sales</li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {loading ? 'Creating Account...' : 'Create Retailer Account'}
          </Button>

          <p className="text-xs text-center text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </CardContent>
    </Card>
  )
}