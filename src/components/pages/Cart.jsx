import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import Reveal from '../common/Reveal'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center px-6">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-6 animate-float">
            <span className="font-display text-2xl text-gold-dark">M</span>
          </div>
          <p className="font-mono text-gold-dark uppercase text-[11px] tracking-[0.35em] mb-3">
            Empty Cart
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mb-3">
            Your cart awaits its first piece
          </h2>
          <p className="text-ink/50 text-sm mb-8">
            Nothing added yet — the collection is ready when you are.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-ink text-bone px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-gold hover:text-ink active:scale-[0.97] animate-glow-pulse transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-bone py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10">
          <span className="font-mono text-gold-dark uppercase text-[11px] tracking-[0.35em]">
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink mt-2">
            Shopping Cart
          </h1>
        </Reveal>

        <Reveal delay={80} className="bg-white border border-ink/10">
          {/* Cart Items */}
          <div className="divide-y divide-ink/10">
            {cartItems.map((item, index) => (
              <div key={index} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 bg-ink/5 overflow-hidden flex-shrink-0 border border-ink/10">
                  {item.image ? (
                    // ✅ FIX: Use environment variable for image URL
                    <img
                      src={`${import.meta.env.VITE_API_URL}/storage/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink/30 font-mono text-[10px] uppercase tracking-wide">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-display text-ink text-lg">{item.name}</h3>
                  <p className="font-mono text-xs text-ink/50 mt-1">
                    GH₵ {item.price}
                    {item.size && ` · SIZE ${item.size}`}
                    {item.color && ` · ${item.color.toUpperCase()}`}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-ink/15 rounded-full overflow-hidden">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="p-2.5 hover:bg-gold/10 active:scale-90 transition"
                  >
                    <MinusIcon className="w-3.5 h-3.5 text-ink/60" />
                  </button>
                  <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="p-2.5 hover:bg-gold/10 active:scale-90 transition"
                  >
                    <PlusIcon className="w-3.5 h-3.5 text-ink/60" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-center sm:text-right min-w-[90px]">
                  <p className="font-mono text-gold-dark font-bold text-sm">
                    GH₵ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-oxblood/70 hover:text-oxblood active:scale-90 transition p-2"
                  aria-label="Remove item"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="p-5 sm:p-7 bg-ink border-t border-gold/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
              <button
                onClick={clearCart}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50 hover:text-oxblood active:scale-95 transition"
              >
                Clear Cart
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="text-center sm:text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/40">Total</p>
                  <p className="text-2xl font-display font-bold text-gold">
                    GH₵ {cartTotal.toFixed(2)}
                  </p>
                </div>

                <Link
                  to="/checkout"
                  className="bg-gold text-ink px-8 py-4 rounded-sm font-mono text-xs uppercase tracking-[0.2em] hover:bg-gold-light active:scale-[0.97] transition-all duration-300"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Continue Shopping */}
        <Reveal delay={140} className="mt-8 text-center">
          <Link to="/shop" className="font-mono text-xs uppercase tracking-[0.2em] text-gold-dark hover:text-gold active:text-gold transition">
            ← Continue Shopping
          </Link>
        </Reveal>
      </div>
    </div>
  )
}

export default Cart