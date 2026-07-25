import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import api, { getImageUrl } from '../../services/api'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext'
import Reveal from '../common/Reveal'

const STOCK_STYLES = {
  in_stock: { dot: 'bg-emerald-700', text: 'text-ink/60', border: 'border-ink/15' },
  low_stock: { dot: 'bg-gold-dark', text: 'text-oxblood', border: 'border-gold/30' },
  out_of_stock: { dot: 'bg-ink/30', text: 'text-ink/40', border: 'border-ink/15' },
}

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [mainImage, setMainImage] = useState('')

  useEffect(() => {
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/public/products/${id}`)
      setProduct(response.data.data)
      if (response.data.data.images && response.data.data.images.length > 0) {
        setMainImage(response.data.data.images[0].image_url)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
      navigate('/shop')
    }
  }

  const handleAddToCart = () => {
    if (product.variations && product.variations.length > 0) {
      if (!selectedSize) {
        toast.error('Please select a size')
        return
      }
      if (!selectedColor) {
        toast.error('Please select a color')
        return
      }
    }

    if (product.stock_quantity < quantity) {
      toast.error(`Only ${product.stock_quantity} items available`)
      return
    }

    addToCart(product, quantity, selectedSize, selectedColor)
  }

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist)
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading Product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink/60 font-mono text-sm">Product not found</p>
          <Link to="/shop" className="text-gold-dark hover:text-gold mt-3 inline-block font-mono text-xs uppercase tracking-[0.2em]">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const stockStatus = product.stock_status || { status: 'out_of_stock', label: 'Out of Stock', color: 'red', icon: '❌' }
  const stockStyle = STOCK_STYLES[stockStatus.status] || STOCK_STYLES.out_of_stock
  const isOutOfStock = stockStatus.status === 'out_of_stock' || product.stock_quantity <= 0

  return (
    <div className="min-h-screen bg-bone py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40 mb-8 animate-fade-up">
          <Link to="/" className="hover:text-gold-dark transition">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-gold-dark transition">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-ink/70">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* IMAGES */}
          <div className="animate-fade-up">
            <div className="bg-white border border-ink/10 p-3">
              <div className="relative aspect-square overflow-hidden bg-ink/5">
                <img
                  key={mainImage}
                  src={mainImage ? getImageUrl(mainImage) : 'https://via.placeholder.com/600x600?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-up"
                />
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(image.image_url)}
                    className={`relative aspect-square overflow-hidden bg-white p-1 border transition-all duration-300 active:scale-95 ${
                      mainImage === image.image_url ? 'border-gold' : 'border-ink/10 hover:border-gold/50'
                    }`}
                  >
                    <img
                      src={getImageUrl(image.image_url)}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <h1
              className="text-3xl sm:text-4xl font-display font-bold text-ink mb-4 leading-tight animate-fade-up"
              style={{ animationDelay: '80ms' }}
            >
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-up" style={{ animationDelay: '130ms' }}>
              <div className="inline-flex items-center gap-2 border border-gold/40 rounded-full pl-2 pr-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark/70" />
                <span className="font-mono text-lg text-ink tracking-wide">GH₵ {product.price}</span>
              </div>

              <div className={`inline-flex items-center gap-2 border rounded-full px-3 py-1.5 ${stockStyle.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stockStyle.dot}`} />
                <span className={`font-mono text-[11px] uppercase tracking-wide ${stockStyle.text}`}>
                  {stockStatus.label}
                </span>
              </div>
            </div>

            <p
              className="text-ink/60 leading-relaxed mb-8 animate-fade-up"
              style={{ animationDelay: '180ms' }}
            >
              {product.description || 'No description available'}
            </p>

            {/* Variations */}
            {product.variations && product.variations.length > 0 && (
              <div className="mb-8 space-y-6 animate-fade-up" style={{ animationDelay: '220ms' }}>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-3">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(product.variations.map(v => v.size))].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-sm text-sm font-mono tracking-wide transition-all duration-300 active:scale-95 ${
                          selectedSize === size
                            ? 'border-gold bg-gold text-ink'
                            : 'border-ink/20 text-ink/70 hover:border-gold hover:text-gold-dark'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-3">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(product.variations.map(v => v.color))].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-sm text-sm font-mono tracking-wide transition-all duration-300 active:scale-95 ${
                          selectedColor === color
                            ? 'border-gold bg-gold text-ink'
                            : 'border-ink/20 text-ink/70 hover:border-gold hover:text-gold-dark'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div
              className="flex items-center gap-4 mb-8 animate-fade-up"
              style={{ animationDelay: '260ms' }}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">Quantity</span>
              <div className="flex items-center border border-ink/15 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 font-mono hover:bg-gold/10 active:scale-90 transition"
                >
                  −
                </button>
                <span className="w-10 text-center font-mono text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stock_quantity || 99))}
                  className="px-4 py-2 font-mono hover:bg-gold/10 active:scale-90 transition"
                >
                  +
                </button>
              </div>
              {product.stock_quantity && (
                <span className="font-mono text-[10px] text-ink/40 tracking-wide">
                  MAX {product.stock_quantity}
                </span>
              )}
            </div>

            {/* Actions */}
            <div
              className="flex flex-wrap gap-4 animate-fade-up"
              style={{ animationDelay: '300ms' }}
            >
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex items-center gap-2 px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 active:scale-[0.97] ${
                  isOutOfStock
                    ? 'bg-ink/10 text-ink/30 cursor-not-allowed'
                    : 'bg-ink text-bone hover:bg-gold hover:text-ink animate-glow-pulse'
                }`}
              >
                <ShoppingCartIcon className="w-4 h-4" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={handleWishlistToggle}
                className="flex items-center gap-2 px-6 py-4 border border-ink/15 rounded-sm font-mono text-xs uppercase tracking-[0.2em] hover:border-gold hover:text-gold-dark active:scale-[0.97] transition-all duration-300"
              >
                <span className={`transition-transform duration-300 ${isInWishlist ? 'scale-110' : 'scale-100'}`}>
                  {isInWishlist ? (
                    <HeartSolidIcon className="w-4 h-4 text-oxblood" />
                  ) : (
                    <HeartIcon className="w-4 h-4" />
                  )}
                </span>
                {isInWishlist ? 'Saved' : 'Wishlist'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-ink/10 animate-fade-up" style={{ animationDelay: '340ms' }}>
              <div className="font-mono text-[11px] text-ink/40 space-y-1 tracking-wide">
                <p>CATEGORY: {(product.category?.name || 'UNCATEGORIZED').toUpperCase()}</p>
                {product.stock_quantity !== undefined && (
                  <p>AVAILABLE: {product.stock_quantity} IN STOCK</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <Reveal className="mt-16 bg-white border border-ink/10 p-6 md:p-10">
            <h2 className="text-xl font-display font-bold text-ink mb-6">
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <Reveal key={review.id} delay={index * 60} className="border-b border-ink/10 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-medium text-ink text-sm">{review.user?.name || 'Anonymous'}</span>
                    <span className="text-sm text-gold-dark">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                    {review.verified_purchase && (
                      <span className="text-[10px] font-mono border border-emerald-700/30 text-emerald-800 px-2 py-0.5 rounded-full tracking-wide">
                        VERIFIED PURCHASE
                      </span>
                    )}
                  </div>
                  <p className="text-ink/60 text-sm leading-relaxed">{review.comment}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}

export default ProductDetails