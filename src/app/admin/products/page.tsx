'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Package, DollarSign, Tag, X, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  description: string
  default_price: number
  category: string
  is_active: boolean
  created_at: string
}

const categories = [
  { value: 'cabinet_boxes', label: 'Cabinet Boxes', icon: '📦' },
  { value: 'door_styles', label: 'Door Styles', icon: '🚪' },
  { value: 'hardware', label: 'Hardware', icon: '🔧' },
  { value: 'labor', label: 'Labor', icon: '👷' },
  { value: 'countertops', label: 'Countertops', icon: '🪨' },
  { value: 'accessories', label: 'Accessories', icon: '✨' },
  { value: 'delivery', label: 'Delivery', icon: '🚚' },
  { value: 'other', label: 'Other', icon: '📌' }
]

const categoryColors: Record<string, { bg: string; text: string }> = {
  cabinet_boxes: { bg: 'bg-amber-100', text: 'text-amber-700' },
  door_styles: { bg: 'bg-blue-100', text: 'text-blue-700' },
  hardware: { bg: 'bg-slate-100', text: 'text-slate-700' },
  labor: { bg: 'bg-purple-100', text: 'text-purple-700' },
  countertops: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  accessories: { bg: 'bg-rose-100', text: 'text-rose-700' },
  delivery: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700' }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    defaultPrice: '',
    category: 'other',
    isActive: true
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoryFilter) params.append('category', categoryFilter)
      if (searchQuery) params.append('search', searchQuery)
      
      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setFormData({
      name: '',
      sku: '',
      description: '',
      defaultPrice: '',
      category: 'other',
      isActive: true
    })
    setShowModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku || '',
      description: product.description || '',
      defaultPrice: product.default_price?.toString() || '',
      category: product.category,
      isActive: product.is_active
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData = {
      name: formData.name,
      sku: formData.sku || null,
      description: formData.description || null,
      defaultPrice: formData.defaultPrice ? parseFloat(formData.defaultPrice) : 0,
      category: formData.category,
      isActive: formData.isActive
    }

    try {
      if (selectedProduct) {
        await fetch(`/api/products/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
      }
      setShowModal(false)
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return
    
    try {
      await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !product.is_active })
      })
      fetchProducts()
    } catch (error) {
      console.error('Error toggling product:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    const matchesSearch = !searchQuery || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const cat = product.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  const totalValue = products.reduce((sum, p) => sum + (p.default_price || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Catalog</h1>
          <p className="text-slate-500 mt-1">Manage products and services for quotes</p>
        </div>
        <button onClick={handleCreateProduct} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{products.length}</div>
              <div className="text-sm text-slate-500">Total Products</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{products.filter(p => p.is_active).length}</div>
              <div className="text-sm text-slate-500">Active</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{categories.length}</div>
              <div className="text-sm text-slate-500">Categories</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-slate-500">Total Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Products Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery || categoryFilter ? 'Try adjusting your filters.' : 'Add your first product to build your quote catalog.'}
          </p>
          {!searchQuery && !categoryFilter && (
            <button onClick={handleCreateProduct} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
              Add First Product
            </button>
          )}
        </div>
      ) : categoryFilter ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onEdit={handleEditProduct} onDelete={handleDelete} onToggleActive={handleToggleActive} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
            const catInfo = categories.find(c => c.value === category) || categories[7]
            const colors = categoryColors[category]
            
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{catInfo.icon}</span>
                  <h2 className="text-lg font-semibold text-slate-900">{catInfo.label}</h2>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                    {categoryProducts.length}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryProducts.map(product => (
                    <ProductCard key={product.id} product={product} onEdit={handleEditProduct} onDelete={handleDelete} onToggleActive={handleToggleActive} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedProduct ? 'Edit Product' : 'New Product'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Shaker White Base Cabinet"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SW-BC-001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Default Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.defaultPrice}
                    onChange={(e) => setFormData({ ...formData, defaultPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description and specifications..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700 cursor-pointer">
                  Active (available in quote builder)
                </label>
              </div>

              <div className="flex justify-between pt-4">
                {selectedProduct && (
                  <button type="button" onClick={() => handleDelete(selectedProduct)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                    {selectedProduct ? 'Update' : 'Create'} Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product, onEdit, onDelete, onToggleActive }: { 
  product: Product
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
  onToggleActive: (p: Product) => void
}) {
  const colors = categoryColors[product.category] || categoryColors.other
  const catInfo = categories.find(c => c.value === product.category) || categories[7]
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-colors ${
      product.is_active ? 'border-slate-200 hover:border-amber-300' : 'border-slate-100 opacity-60'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center text-lg`}>
              {catInfo.icon}
            </div>
            <div>
              <div className="font-semibold text-slate-900">{product.name}</div>
              {product.sku && (
                <div className="text-xs text-slate-400 font-mono">{product.sku}</div>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onToggleActive(product)}
              className={`p-1.5 rounded-lg transition-colors ${product.is_active ? 'hover:bg-emerald-50' : 'hover:bg-slate-100'}`}
              title={product.is_active ? 'Deactivate' : 'Activate'}
            >
              {product.is_active ? (
                <Eye className="w-4 h-4 text-emerald-500" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <button
              onClick={() => onEdit(product)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
        
        {product.description && (
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
            {catInfo.label}
          </span>
          <span className="text-lg font-bold text-slate-900">
            ${product.default_price?.toLocaleString() || '0'}
          </span>
        </div>
      </div>
    </div>
  )
}
