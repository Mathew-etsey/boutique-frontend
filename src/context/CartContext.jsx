import React, { createContext, useState, useEffect, useContext } from 'react'
import toast from 'react-hot-toast'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  // Initialize state from localStorage
  const getInitialCart = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
      return []
    } catch (e) {
      console.error('Failed to parse cart:', e)
      return []
    }
  }

  const [cartItems, setCartItems] = useState(getInitialCart)
  const [cartTotal, setCartTotal] = useState(0)
  const [cartCount, setCartCount] = useState(0)

  // Update totals whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
    
    const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
    const count = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    
    setCartTotal(total)
    setCartCount(count)
  }, [cartItems])

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCartItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : []
      
      const existingIndex = currentItems.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      )

      if (existingIndex >= 0) {
        const updatedItems = [...currentItems]
        updatedItems[existingIndex].quantity += quantity
        toast.success(`Updated ${product.name} quantity`)
        return updatedItems
      } else {
        // ✅ Custom toast with cart icon and 8 second duration
        toast.success(
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              <ShoppingCartIcon className="w-5 h-5 text-gold" />
            </div>
            <div>
              <div className="font-medium text-bone">{product.name} added to cart!</div>
              <div className="text-xs text-bone/60 mt-0.5">
                Tap the <span className="text-gold font-medium">cart icon</span> above to proceed with your order
              </div>
            </div>
          </div>,
          {
            duration: 4000,
            style: {
              background: '#0B0B0C',
              color: '#EDE6D8',
              border: '1px solid #B8923F',
              borderRadius: '12px',
              padding: '16px 20px',
              maxWidth: '420px',
            },
          }
        )
        return [...currentItems, {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price) || 0,
          image: product.images?.[0]?.image_url || null,
          quantity: quantity,
          size: size || '',
          color: color || '',
          maxStock: product.stock_quantity || 0
        }]
      }
    })
  }

  const removeFromCart = (index) => {
    setCartItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : []
      const removedItem = currentItems[index]
      if (removedItem) {
        toast.success(`Removed ${removedItem.name} from cart`)
      }
      return currentItems.filter((_, i) => i !== index)
    })
  }

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : []
      const updatedItems = [...currentItems]
      const item = updatedItems[index]
      
      if (!item) return currentItems
      
      if (newQuantity > item.maxStock) {
        toast.error(`Only ${item.maxStock} items available`)
        return currentItems
      }
      
      updatedItems[index].quantity = newQuantity
      return updatedItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.setItem('cart', JSON.stringify([]))
    toast.success('Cart cleared')
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}