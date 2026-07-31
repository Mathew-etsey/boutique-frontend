import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { getImageUrl } from '../../services/api'
import toast from 'react-hot-toast'

const AdminProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    is_featured: false,
    images: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [existingImage, setExistingImage] = useState(null)

  // ===== VARIATIONS STATE =====
  const [variations, setVariations] = useState([])
  const [variationsLoading, setVariationsLoading] = useState(false)
  const [newVariation, setNewVariation] = useState({
    size: '',
    color: '',
    quantity: ''
  })
  const [addingVariation, setAddingVariation] = useState(false)
  const [deletingVariation, setDeletingVariation] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/admin/categories')
        setCategories(response.data.data || [])
        if (response.data.data?.length > 0) {
          setFormData(prev => ({ ...prev, category_id: response.data.data[0].id }))
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/admin/products/${id}`)
          const product = response.data.data
          setFormData({
            category_id: product.category_id || '',
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            stock_quantity: product.stock_quantity || '',
            is_featured: product.is_featured == 1,
            images: null
          })
          if (product.images && product.images.length > 0) {
            setExistingImage(product.images[0].image_url)
          }
          // Fetch variations for this product
          fetchVariations()
        } catch (error) {
          console.error('Error fetching product:', error)
          toast.error('Failed to load product')
        }
      }
      fetchProduct()
    }
  }, [id, isEditing])

  // ===== FETCH VARIATIONS =====
  const fetchVariations = async () => {
    if (!id) return
    setVariationsLoading(true)
    try {
      const response = await api.get('/admin/product-variations', {
        params: { product_id: id }
      })
      setVariations(response.data.data || [])
    } catch (error) {
      console.error('Error fetching variations:', error)
    } finally {
      setVariationsLoading(false)
    }
  }

  // ===== ADD VARIATION =====
  const handleAddVariation = async (e) => {
    e.preventDefault()
    
    if (!newVariation.size || !newVariation.color || !newVariation.quantity) {
      toast.error('Please fill in all variation fields')
      return
    }

    setAddingVariation(true)
    try {
      const response = await api.post('/admin/product-variations', {
        product_id: id,
        size: newVariation.size,
        color: newVariation.color,
        quantity: parseInt(newVariation.quantity)
      })

      if (response.data.success) {
        toast.success('Variation added successfully!')
        setVariations([...variations, response.data.data])
        setNewVariation({ size: '', color: '', quantity: '' })
        // Update stock quantity in form
        setFormData(prev => ({
          ...prev,
          stock_quantity: parseInt(prev.stock_quantity) + parseInt(newVariation.quantity)
        }))
      }
    } catch (error) {
      console.error('Error adding variation:', error)
      toast.error(error.response?.data?.message || 'Failed to add variation')
    } finally {
      setAddingVariation(false)
    }
  }

  // ===== DELETE VARIATION =====
  const handleDeleteVariation = async (variationId) => {
    if (!window.confirm('Are you sure you want to delete this variation?')) return

    setDeletingVariation(variationId)
    try {
      await api.delete(`/admin/product-variations/${variationId}`)
      const deletedVariation = variations.find(v => v.id === variationId)
      setVariations(variations.filter(v => v.id !== variationId))
      // Update stock quantity in form
      if (deletedVariation) {
        setFormData(prev => ({
          ...prev,
          stock_quantity: parseInt(prev.stock_quantity) - parseInt(deletedVariation.quantity)
        }))
      }
      toast.success('Variation deleted successfully!')
    } catch (error) {
      console.error('Error deleting variation:', error)
      toast.error('Failed to delete variation')
    } finally {
      setDeletingVariation(null)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleVariationChange = (e) => {
    const { name, value } = e.target
    setNewVariation(prev => ({ ...prev, [name]: value }))
  }

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1200
          const MAX_HEIGHT = 1200
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          }, 'image/jpeg', 0.85)
        }
      }
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 10MB.')
        e.target.value = ''
        return
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload JPG, PNG, GIF, or WEBP.')
        e.target.value = ''
        return
      }

      const loadingToast = toast.loading('Compressing image...')

      try {
        const compressedFile = await compressImage(file)

        setFormData(prev => ({ ...prev, images: compressedFile }))
        setImagePreview(URL.createObjectURL(compressedFile))
        setExistingImage(null)

        toast.dismiss(loadingToast)
        toast.success(`Image compressed! (${(compressedFile.size / 1024).toFixed(0)} KB)`)
      } catch (error) {
        console.error('Compression error:', error)
        toast.dismiss(loadingToast)
        toast.error('Failed to compress. Using original.')
        setFormData(prev => ({ ...prev, images: file }))
        setImagePreview(URL.createObjectURL(file))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append('category_id', formData.category_id)
      data.append('name', formData.name)
      data.append('description', formData.description || '')
      data.append('price', formData.price)
      data.append('stock_quantity', formData.stock_quantity)
      data.append('is_featured', formData.is_featured ? '1' : '0')

      if (formData.images && formData.images instanceof File) {
        data.append('images', formData.images)
      }

      let response
      if (isEditing) {
        data.append('_method', 'PUT')
        response = await api.post(`/admin/products/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        response = await api.post('/admin/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      if (response.data.success) {
        toast.success(isEditing ? 'Product updated!' : 'Product created!')
        navigate('/admin/products')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      if (error.response) {
        if (error.response.data.errors) {
          const errors = error.response.data.errors
          Object.keys(errors).forEach(key => {
            toast.error(`${key}: ${errors[key][0]}`)
          })
        } else {
          toast.error(error.response.data.message || 'Failed to save product')
        }
      } else {
        toast.error('Failed to save product')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-transparent border-b border-ink/20 pb-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors duration-300"

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-ink mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white border border-ink/10 rounded-sm p-5 sm:p-8 max-w-2xl space-y-5">
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
            Category
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className={`${inputClass} bg-white`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`${inputClass} resize-none`}
            placeholder="Enter product description"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
            Price (GH₵)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className={inputClass}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
            Stock Quantity
          </label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
            min="0"
            className={inputClass}
            placeholder="0"
          />
        </div>

        {/* ===== FEATURED TOGGLE ===== */}
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
            Featured Product
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                formData.is_featured ? 'bg-gold' : 'bg-ink/20'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  formData.is_featured ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm text-ink/60">
              {formData.is_featured ? 'Yes, feature this product' : 'No, don\'t feature'}
            </span>
          </div>
        </div>

        {/* ===== PRODUCT VARIATIONS SECTION ===== */}
        {isEditing && (
          <div className="border-t border-ink/10 pt-6 mt-2">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-4">
              Product Variations
            </h3>

            {/* Add Variation Form */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/40 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={newVariation.size}
                  onChange={handleVariationChange}
                  placeholder="e.g., S, M, L"
                  className={`${inputClass} text-sm pb-2`}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/40 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={newVariation.color}
                  onChange={handleVariationChange}
                  placeholder="e.g., Black, White"
                  className={`${inputClass} text-sm pb-2`}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/40 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={newVariation.quantity}
                  onChange={handleVariationChange}
                  placeholder="0"
                  min="0"
                  className={`${inputClass} text-sm pb-2`}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddVariation}
                  disabled={addingVariation}
                  className="w-full bg-gold text-ink px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-[0.15em] hover:bg-gold-light active:scale-[0.97] transition-all duration-300 disabled:opacity-50"
                >
                  {addingVariation ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>

            {/* Variations List */}
            {variationsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gold border-t-transparent mx-auto"></div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-ink/40">Loading variations...</p>
              </div>
            ) : variations.length === 0 ? (
              <p className="text-sm text-ink/40 text-center py-4 border border-ink/10 rounded-sm">
                No variations added yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink/10">
                      <th className="text-left font-mono text-[10px] uppercase tracking-wide text-ink/40 py-2">Size</th>
                      <th className="text-left font-mono text-[10px] uppercase tracking-wide text-ink/40 py-2">Color</th>
                      <th className="text-right font-mono text-[10px] uppercase tracking-wide text-ink/40 py-2">Quantity</th>
                      <th className="text-right font-mono text-[10px] uppercase tracking-wide text-ink/40 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variations.map((variation) => (
                      <tr key={variation.id} className="border-b border-ink/5">
                        <td className="py-2 font-mono text-sm">{variation.size}</td>
                        <td className="py-2 font-mono text-sm">{variation.color}</td>
                        <td className="py-2 font-mono text-sm text-right">{variation.quantity}</td>
                        <td className="py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteVariation(variation.id)}
                            disabled={deletingVariation === variation.id}
                            className="text-ink/30 hover:text-oxblood font-mono text-[10px] uppercase tracking-wide transition disabled:opacity-50"
                          >
                            {deletingVariation === variation.id ? '...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
            Product Image
          </label>

          {isEditing && existingImage && !imagePreview && (
            <div className="mb-3">
              <p className="font-mono text-[10px] uppercase tracking-wide text-ink/40 mb-2">Current Image</p>
              <img
                src={getImageUrl(existingImage)}
                alt="Current product"
                className="w-28 h-28 object-cover rounded-sm border border-ink/10"
              />
            </div>
          )}

          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full border border-ink/15 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition"
          />
          {imagePreview && (
            <div className="mt-3">
              <p className="font-mono text-[10px] uppercase tracking-wide text-emerald-800 mb-2">New Image Preview</p>
              <img src={imagePreview} alt="Preview" className="w-28 h-28 object-cover rounded-sm border-2 border-gold" />
            </div>
          )}
          {isEditing && !imagePreview && existingImage && (
            <p className="font-mono text-[10px] text-ink/40 mt-2">Leave empty to keep current image</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-gold text-ink px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-[0.15em] hover:bg-gold-light active:scale-[0.97] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="border border-ink/15 text-ink/70 px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-[0.15em] hover:border-ink/30 active:scale-[0.97] transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductForm