import { useState } from 'react'
import { Plus, Link, Image, DollarSign, Tag, Palette, Ruler } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ProductService } from '@/services/productService'
import type { ProductCreateRequest } from '@/types'

interface AddProductModalProps {
  onProductAdded?: () => void
}

export function AddProductModal({ onProductAdded }: AddProductModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductCreateRequest>({
    name: '',
    description: '',
    price: 0,
    photo: '',
    photos: [],
    url: '',
    originalUrl: '',
    color: '',
    size: '',
    keywords: []
  })
  const [keywordInput, setKeywordInput] = useState('')
  const [photoInput, setPhotoInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await ProductService.createProduct(formData)
      setOpen(false)
      resetForm()
      onProductAdded?.()
    } catch (error) {
      console.error('Failed to create product:', error)
      
      // Check if it's a database not found error
      if (error instanceof Error && error.message.includes('Database for project')) {
        alert('Database is being set up. This feature will be available soon. For now, you can explore the demo interface.')
      } else {
        alert('Failed to create product. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      photo: '',
      photos: [],
      url: '',
      originalUrl: '',
      color: '',
      size: '',
      keywords: []
    })
    setKeywordInput('')
    setPhotoInput('')
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords?.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()]
      }))
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords?.filter(k => k !== keyword) || []
    }))
  }

  const addPhoto = () => {
    if (photoInput.trim() && !formData.photos?.includes(photoInput.trim())) {
      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), photoInput.trim()]
      }))
      setPhotoInput('')
    }
  }

  const removePhoto = (photo: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos?.filter(p => p !== photo) || []
    }))
  }

  const extractFromUrl = async () => {
    if (!formData.url) return

    setLoading(true)
    try {
      // In a real implementation, this would call a service to extract product data from URL
      // For now, we'll simulate it
      const domain = new URL(formData.url).hostname
      
      setFormData(prev => ({
        ...prev,
        originalUrl: prev.url,
        name: prev.name || `Product from ${domain}`,
        description: prev.description || `Product imported from ${domain}`
      }))
    } catch (error) {
      console.error('Failed to extract from URL:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span>Add New Product</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input with Extract Button */}
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center space-x-2">
              <Link className="h-4 w-4" />
              <span>Product URL</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/product"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={extractFromUrl}
                disabled={!formData.url || loading}
              >
                Extract
              </Button>
            </div>
          </div>

          {/* Basic Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Price</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Main Photo */}
          <div className="space-y-2">
            <Label htmlFor="photo" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Main Photo URL</span>
            </Label>
            <Input
              id="photo"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.photo}
              onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
              required
            />
            {formData.photo && (
              <div className="mt-2">
                <img
                  src={formData.photo}
                  alt="Product preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Additional Photos */}
          <div className="space-y-2">
            <Label>Additional Photos</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
              />
              <Button type="button" variant="outline" onClick={addPhoto}>
                Add
              </Button>
            </div>
            {formData.photos && formData.photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Additional ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removePhoto(photo)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Color</span>
              </Label>
              <Input
                id="color"
                placeholder="e.g., Red, Blue, Black"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="flex items-center space-x-2">
                <Ruler className="h-4 w-4" />
                <span>Size</span>
              </Label>
              <Input
                id="size"
                placeholder="e.g., S, M, L, XL"
                value={formData.size}
                onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
              />
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Keywords</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add keyword"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <Button type="button" variant="outline" onClick={addKeyword}>
                Add
              </Button>
            </div>
            {formData.keywords && formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => removeKeyword(keyword)}
                  >
                    {keyword} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Preview Card */}
          {formData.name && formData.photo && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.photo}
                    alt={formData.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{formData.name}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">{formData.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-lg">${formData.price.toFixed(2)}</span>
                      <div className="flex space-x-2">
                        {formData.color && (
                          <Badge variant="outline">{formData.color}</Badge>
                        )}
                        {formData.size && (
                          <Badge variant="outline">{formData.size}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}