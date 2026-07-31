import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import api, { getImageUrl } from '../../services/api'
import toast from 'react-hot-toast'
import PageTitle from '../common/PageTitle'

const RadioCard = ({ name, value, checked, onChange, title, subtitle, price, priceClass }) => (
  <label
    className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all duration-300 active:scale-[0.99] ${
      checked ? 'border-gold bg-gold/5' : 'border-ink/15 hover:border-gold/40'
    }`}
  >
    <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${checked ? 'border-gold' : 'border-ink/30'}`}>
      {checked && <span className="w-2 h-2 rounded-full bg-gold" />}
    </span>
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    <div>
      <p className="font-medium text-ink text-sm">{title}</p>
      <p className="text-xs text-ink/50 mt-0.5">{subtitle}</p>
      <p className={`font-mono text-xs mt-1 ${priceClass}`}>{price}</p>
    </div>
  </label>
)

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  const [loading, setLoading] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('pickup')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryZone, setDeliveryZone] = useState('Greater Accra')
  const [orderNotes, setOrderNotes] = useState('')
  const [orderData, setOrderData] = useState(null)
  const [isPaystackReady, setIsPaystackReady] = useState(false)

  const [checkoutType, setCheckoutType] = useState('guest')
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (window.PaystackPop) {
      setIsPaystackReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => {
      console.log('Paystack script loaded successfully')
      setIsPaystackReady(true)
    }
    script.onerror = () => {
      console.error('Failed to load Paystack script')
      toast.error('Failed to load payment system. Please refresh.')
    }
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop')
      toast.error('Your cart is empty')
      return
    }
  }, [cartItems.length, navigate])

  const deliveryZones = [
    'Greater Accra',
    'Ashanti Region',
    'Western Region',
    'Eastern Region',
    'Central Region',
    'Volta Region',
    'Northern Region',
    'Upper East',
    'Upper West'
  ]

  const totalWithDelivery = cartTotal

  const payWithPaystack = (order) => {
    if (!window.PaystackPop) {
      toast.error('Payment system not available. Please refresh and try again.')
      return
    }

    const email = isAuthenticated() ? user?.email : guestData.email

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_47f8fe5de0aa259e576eebbeb21994c37',
      email: email,
      amount: Math.round(totalWithDelivery * 100),
      currency: 'GHS',
      ref: order.order_number,
      metadata: {
        order_id: order.id,
        custom_fields: [
          {
            display_name: "Order Number",
            variable_name: "order_number",
            value: order.order_number
          }
        ]
      },
      callback: function(response) {
        handlePaystackSuccess(response, order)
      },
      onClose: function() {
        toast.error('Payment cancelled')
      }
    })

    handler.openIframe()
  }

  const handlePaystackSuccess = async (response, order) => {
    try {
      const verifyResponse = await api.post('/verify-payment', {
        reference: response.reference
      })

      if (verifyResponse.data.success) {
        toast.success('Payment successful! Order confirmed.')
        clearCart()
        navigate(`/order-confirmation/${order.id}`)
      } else {
        toast.error('Payment verification failed. Please contact support.')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      toast.error('Payment verification failed. Please contact support.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if ((deliveryMethod === 'delivery' || deliveryMethod === 'express') && !deliveryAddress) {
      toast.error('Please enter your delivery address')
      return
    }

    if (!isAuthenticated()) {
      if (!guestData.name || !guestData.email || !guestData.phone) {
        toast.error('Please fill in all guest details')
        return
      }
      if (!guestData.email.includes('@')) {
        toast.error('Please enter a valid email address')
        return
      }
    }

    if (!isPaystackReady) {
      toast.error('Payment system is still loading. Please wait...')
      return
    }

    setLoading(true)

    try {
      // ===== UPDATED: Include size and color in order items =====
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size || null,    // ← ADDED
        color: item.color || null,  // ← ADDED
      }))

      const orderDataPayload = {
        user_id: isAuthenticated() ? user.id : null,
        guest_name: !isAuthenticated() ? guestData.name : null,
        guest_email: !isAuthenticated() ? guestData.email : null,
        guest_phone: !isAuthenticated() ? guestData.phone : null,
        items: items,
        delivery_method: deliveryMethod,
        delivery_address: deliveryMethod === 'pickup' ? null : deliveryAddress,
        delivery_zone: deliveryZone,
        order_notes: orderNotes || null
      }

      const response = await api.post('/customer/orders', orderDataPayload)

      if (response.data.success) {
        const order = response.data.data
        setOrderData(order)
        toast.success('Order created! Complete payment.')

        setTimeout(() => {
          payWithPaystack(order)
        }, 300)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestChange = (e) => {
    setGuestData({ ...guestData, [e.target.name]: e.target.value })
  }

  const inputClass = "w-full bg-transparent border-b border-ink/20 pb-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors duration-300"

  return (
    <>
      <PageTitle 
        title="Checkout"
        description="Complete your order securely."
      />
      <div className="min-h-screen bg-bone py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-up">
            <span className="font-mono text-gold-dark uppercase text-[11px] tracking-[0.35em]">Almost There</span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink mt-2">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white border border-ink/10 p-5 sm:p-7 space-y-8 animate-fade-up" style={{ animationDelay: '80ms' }}>

                {/* Account Type Selection */}
                {!isAuthenticated() && (
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-4">
                      Choose Checkout Type
                    </h3>
                    <div className="space-y-3">
                      <RadioCard
                        name="checkoutType"
                        value="guest"
                        checked={checkoutType === 'guest'}
                        onChange={(e) => setCheckoutType(e.target.value)}
                        title="Checkout as Guest"
                        subtitle="No account needed"
                        price=""
                        priceClass=""
                      />
                      <RadioCard
                        name="checkoutType"
                        value="login"
                        checked={checkoutType === 'login'}
                        onChange={(e) => setCheckoutType(e.target.value)}
                        title="Sign In"
                        subtitle="For faster checkout"
                        price=""
                        priceClass=""
                      />
                    </div>
                  </div>
                )}

                {/* Guest Form */}
                {!isAuthenticated() && checkoutType === 'guest' && (
                  <div className="p-5 bg-bone/60 border border-ink/10 rounded-sm">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-4">
                      Guest Details
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/50 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={guestData.name}
                          onChange={handleGuestChange}
                          required
                          className={inputClass}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/50 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={guestData.email}
                          onChange={handleGuestChange}
                          required
                          className={inputClass}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/50 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={guestData.phone}
                          onChange={handleGuestChange}
                          required
                          className={inputClass}
                          placeholder="0244123456"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Login Option */}
                {!isAuthenticated() && checkoutType === 'login' && (
                  <div className="p-5 bg-bone/60 border border-ink/10 rounded-sm text-center">
                    <p className="text-ink/70 text-sm">
                      Already have an account?{' '}
                      <Link to="/login" className="text-gold-dark hover:text-gold font-medium transition">
                        Sign In
                      </Link>
                    </p>
                    <p className="text-xs text-ink/40 mt-2">
                      Or{' '}
                      <button
                        type="button"
                        onClick={() => setCheckoutType('guest')}
                        className="text-gold-dark hover:text-gold transition"
                      >
                        continue as guest
                      </button>
                    </p>
                  </div>
                )}

                {/* Delivery Method */}
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-4">
                    Delivery Method
                  </h3>
                  <div className="space-y-3">
                    <RadioCard
                      name="delivery"
                      value="pickup"
                      checked={deliveryMethod === 'pickup'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      title="Pickup"
                      subtitle="Collect from our boutique"
                      price="FREE"
                      priceClass="text-emerald-700"
                    />
                    <RadioCard
                      name="delivery"
                      value="delivery"
                      checked={deliveryMethod === 'delivery'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      title="Delivery"
                      subtitle="Delivered to your address"
                      price="Free"
                      priceClass="text-emerald-700"
                    />
                    <RadioCard
                      name="delivery"
                      value="express"
                      checked={deliveryMethod === 'express'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      title="Express Delivery"
                      subtitle="Same day delivery (within Accra)"
                      price="Free"
                      priceClass="text-emerald-700"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                {(deliveryMethod === 'delivery' || deliveryMethod === 'express') && (
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-4">
                      Delivery Address
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/50 mb-2">
                          Address
                        </label>
                        <textarea
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          required={deliveryMethod !== 'pickup'}
                          rows="3"
                          className={`${inputClass} resize-none`}
                          placeholder="Enter your delivery address"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/50 mb-2">
                          Region
                        </label>
                        <select
                          value={deliveryZone}
                          onChange={(e) => setDeliveryZone(e.target.value)}
                          className={`${inputClass} bg-white`}
                        >
                          {deliveryZones.map((zone) => (
                            <option key={zone} value={zone}>{zone}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Notes */}
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-4">
                    Additional Notes
                  </h3>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows="3"
                    className={`${inputClass} resize-none`}
                    placeholder="Any special instructions? (e.g., gift wrapping, delivery instructions)"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-ink py-4 rounded-sm font-mono text-xs uppercase tracking-[0.25em] hover:bg-gold-light active:scale-[0.98] animate-glow-pulse transition-all duration-300 disabled:opacity-50 disabled:animate-none"
                >
                  {loading ? 'Processing...' : `Place Order · GH₵ ${cartTotal.toFixed(2)}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-ink text-bone p-6 sticky top-24 animate-fade-up" style={{ animationDelay: '140ms' }}>
                <h3 className="font-display text-lg font-bold mb-5">
                  Order Summary
                </h3>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-12 h-12 bg-bone/10 overflow-hidden flex-shrink-0 border border-gold/20">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-bone/30 text-[9px] font-mono">
                            NO IMG
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-bone truncate">{item.name}</p>
                        {item.size && (
                          <p className="text-bone/40 text-[10px] font-mono">
                            Size: {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p className="text-bone/40 text-[10px] font-mono">
                            Color: {item.color}
                          </p>
                        )}
                        <p className="text-bone/40 text-xs font-mono">
                          {item.quantity} × GH₵ {item.price}
                        </p>
                      </div>
                      <p className="font-mono text-bone/80 text-xs whitespace-nowrap">
                        GH₵ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gold/15 mt-5 pt-5 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-bone/50">Subtotal</span>
                    <span className="font-mono text-bone">GH₵ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gold/15 pt-3 flex justify-between items-baseline">
                    <span className="font-mono text-[11px] uppercase tracking-wide text-bone/60">Total</span>
                    <span className="text-gold font-display text-xl font-bold">GH₵ {totalWithDelivery.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/cart"
                  className="block text-center font-mono text-[11px] uppercase tracking-[0.2em] text-gold/70 hover:text-gold active:text-gold transition mt-6"
                >
                  ← Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout