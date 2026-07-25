import React, { createContext, useState, useEffect, useContext } from 'react'
import toast from 'react-hot-toast'

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
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems))
    
    // Calculate totals
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
        toast.success(`Added ${product.name} to cart`)
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