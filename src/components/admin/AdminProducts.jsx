import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const stockStyle = (qty) => {
  if (qty <= 0) return 'border-oxblood/30 text-oxblood bg-oxblood/5'
  if (qty <= 5) return 'border-gold/40 text-gold-dark bg-gold/10'
  return 'border-emerald-700/30 text-emerald-800 bg-emerald-700/5'
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products')
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await api.delete(`/admin/products/${id}`)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading Products...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl font-display font-bold text-ink">
          Products
        </h1>
        <Link
          to="/admin/products/create"
          className="bg-ink text-bone px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-[0.15em] hover:bg-gold hover:text-ink active:scale-[0.97] transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-ink/10 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-bone border-b border-ink/10">
              <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Product</th>
              <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Price</th>
              <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Stock</th>
              <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Category</th>
              <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 font-mono text-sm text-ink/40">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-ink/5 hover:bg-bone/60 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {product.images && product.images.length > 0 ? (
                        // ✅ FIX: Use environment variable for image URL
                        <img
                          src={`${import.meta.env.VITE_API_URL}/storage/${product.images[0].image_url}`}
                          alt={product.name}
                          className="w-11 h-11 object-cover rounded-sm flex-shrink-0 border border-ink/10"
                        />
                      ) : (
                        <div className="w-11 h-11 bg-ink/5 rounded-sm flex items-center justify-center text-ink/30 font-mono text-[9px] flex-shrink-0">
                          NO IMG
                        </div>
                      )}
                      <span className="font-medium text-ink text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm text-gold-dark">GH₵ {product.price}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block border rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${stockStyle(product.stock_quantity)}`}>
                      {product.stock_quantity} left
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-ink/60">{product.category?.name || 'Uncategorized'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-2 text-ink/60 hover:bg-gold/10 hover:text-gold-dark rounded-sm active:scale-90 transition"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-oxblood/70 hover:bg-oxblood/10 hover:text-oxblood rounded-sm active:scale-90 transition"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.length === 0 ? (
          <p className="text-center py-10 font-mono text-sm text-ink/40">No products found</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white border border-ink/10 rounded-sm p-4">
              <div className="flex items-center gap-3">
                {product.images && product.images.length > 0 ? (
                  // ✅ FIX: Use environment variable for image URL
                  <img
                    src={`${import.meta.env.VITE_API_URL}/storage/${product.images[0].image_url}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-sm flex-shrink-0 border border-ink/10"
                  />
                ) : (
                  <div className="w-16 h-16 bg-ink/5 rounded-sm flex items-center justify-center text-ink/30 font-mono text-[9px] flex-shrink-0">
                    NO IMG
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink text-sm truncate">{product.name}</p>
                  <p className="font-mono text-sm text-gold-dark mt-1">GH₵ {product.price}</p>
                  <p className="text-xs text-ink/50 mt-0.5">{product.category?.name || 'Uncategorized'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink/5">
                <span className={`inline-block border rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${stockStyle(product.stock_quantity)}`}>
                  {product.stock_quantity} left
                </span>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="p-2 text-ink/60 hover:bg-gold/10 hover:text-gold-dark rounded-sm active:scale-90 transition"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-oxblood/70 hover:bg-oxblood/10 hover:text-oxblood rounded-sm active:scale-90 transition"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminProducts