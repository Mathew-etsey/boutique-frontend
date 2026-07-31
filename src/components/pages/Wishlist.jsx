import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api, { getImageUrl } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import PageTitle from '../common/PageTitle'

const Wishlist = () => {
  const { isAuthenticated, user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false)
      return
    }
    fetchWishlist()
  }, [isAuthenticated])

  const fetchWishlist = async () => {
    try {
      // UPDATED: /wishlist → /customer/wishlist
      const response = await api.get('/customer/wishlist', {
        params: { user_id: user.id }
      })
      setWishlist(response.data.data || [])
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (wishlistId) => {
    setRemoving(wishlistId)
    try {
      // UPDATED: /wishlist/{id} → /customer/wishlist/{id}
      await api.delete(`/customer/wishlist/${wishlistId}`)
      setWishlist(wishlist.filter(item => item.id !== wishlistId))
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    } finally {
      setRemoving(null)
    }
  }

  if (!isAuthenticated()) {
    return (
      <>
        <PageTitle 
          title="Wishlist"
          description="Please login to view your wishlist"
        />
        <div className="min-h-screen bg-bone py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-display font-bold text-ink mb-4">Wishlist</h1>
            <div className="bg-white border border-ink/10 p-8 text-center">
              <p className="text-ink/60">Please login to view your wishlist</p>
              <Link 
                to="/login" 
                className="inline-block mt-4 bg-gold text-ink px-6 py-2 rounded-sm font-mono text-xs uppercase tracking-wide hover:bg-gold-light transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <PageTitle 
          title="Wishlist"
          description="Loading your wishlist..."
        />
        <div className="min-h-screen bg-bone py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-display font-bold text-ink mb-4">Wishlist</h1>
            <div className="bg-white border border-ink/10 p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold border-t-transparent mx-auto"></div>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (wishlist.length === 0) {
    return (
      <>
        <PageTitle 
          title="Wishlist"
          description="Your saved items"
        />
        <div className="min-h-screen bg-bone py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-display font-bold text-ink mb-4">Wishlist</h1>
            <div className="bg-white border border-ink/10 p-8 text-center">
              <p className="text-ink/60">Your wishlist is empty</p>
              <Link 
                to="/shop" 
                className="inline-block mt-4 bg-gold text-ink px-6 py-2 rounded-sm font-mono text-xs uppercase tracking-wide hover:bg-gold-light transition"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageTitle 
        title="Wishlist"
        description={`${wishlist.length} items in your wishlist`}
      />
      <div className="min-h-screen bg-bone py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-display font-bold text-ink">Wishlist</h1>
            <span className="font-mono text-sm text-ink/50">{wishlist.length} items</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white border border-ink/10 rounded-sm hover:border-gold/40 transition group">
                <Link to={`/product/${item.product.id}`} className="block p-3">
                  <div className="aspect-square overflow-hidden bg-ink/5">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={getImageUrl(item.product.images[0].image_url)}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink/20 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-ink text-sm mt-2 line-clamp-1">{item.product.name}</h3>
                  <p className="font-mono text-sm text-gold-dark">GH₵ {item.product.price}</p>
                </Link>
                <div className="px-3 pb-3">
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removing === item.id}
                    className="w-full text-center text-xs font-mono uppercase tracking-wide text-ink/40 hover:text-oxblood border border-ink/10 hover:border-oxblood/30 py-1.5 rounded-sm transition duration-300 disabled:opacity-50"
                  >
                    {removing === item.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Wishlist