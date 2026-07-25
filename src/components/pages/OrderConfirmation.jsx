import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { CheckCircleIcon, ShoppingBagIcon, TruckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/solid'
import logoGold from '../../assets/logo-gold.png'
import Reveal from '../common/Reveal'

const STATUS_STYLES = {
  pending: { style: 'border-gold/40 text-gold-dark bg-gold/10', icon: ClockIcon },
  payment_confirmed: { style: 'border-ink/20 text-ink/70 bg-ink/5', icon: CheckCircleIcon },
  processing: { style: 'border-ink/20 text-ink/70 bg-ink/5', icon: TruckIcon },
  ready_for_pickup: { style: 'border-ink/20 text-ink/70 bg-ink/5', icon: ShoppingBagIcon },
  completed: { style: 'border-emerald-700/30 text-emerald-800 bg-emerald-700/5', icon: CheckCircleIcon },
  cancelled: { style: 'border-oxblood/30 text-oxblood bg-oxblood/5', icon: XCircleIcon },
}

const OrderConfirmation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAccountPrompt, setShowAccountPrompt] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/public/orders/${id}`)
        setOrder(response.data.data)
      } catch (error) {
        console.error('Error fetching order:', error)
        if (error.response?.status === 404) {
          navigate('/shop')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id, navigate])

  const getStatusBadge = (status) => {
    const info = STATUS_STYLES[status] || STATUS_STYLES.pending
    const Icon = info.icon
    return (
      <span className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${info.style}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.replace('_', ' ')}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading Order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-ink/60 font-mono text-sm mb-5">Order not found</p>
          <Link
            to="/shop"
            className="inline-block bg-gold text-ink px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-[0.2em] hover:bg-gold-light active:scale-[0.97] transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const isGuest = !order.user_id || order.guest_name !== null

  return (
    <div className="min-h-screen bg-bone py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <Reveal className="bg-white border border-ink/10">
          {/* Header */}
          <div className="bg-ink px-6 py-10 sm:px-8 text-center">
            <img src={logoGold} alt="Masterpiece" className="h-9 w-auto mx-auto mb-6 animate-float" />
            <div className="w-16 h-16 rounded-full border-2 border-gold/40 flex items-center justify-center mx-auto">
              <CheckCircleIcon className="w-9 h-9 text-gold" />
            </div>
          </div>

          <div className="p-6 sm:p-9">
            <p className="text-center font-mono text-gold-dark uppercase text-[11px] tracking-[0.35em] mb-2">
              Order Confirmed
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink text-center">
              Order Placed Successfully
            </h1>
            <p className="text-center text-ink/50 text-sm mt-2">
              Thank you for your order — we'll confirm it shortly.
            </p>

            {/* Order Details */}
            <div className="mt-8 border border-ink/10 rounded-sm p-5 sm:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] uppercase tracking-wide text-ink/40">Order Number</span>
                <span className="font-display font-bold text-ink tracking-wide">{order.order_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] uppercase tracking-wide text-ink/40">Date</span>
                <span className="text-sm text-ink/70">
                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] uppercase tracking-wide text-ink/40">Total</span>
                <span className="font-display font-bold text-xl text-gold-dark">GH₵ {order.total_amount}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-ink/10">
                <span className="font-mono text-[11px] uppercase tracking-wide text-ink/40">Status</span>
                {getStatusBadge(order.order_status)}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-ink/50">
                Estimated Delivery:{' '}
                <span className="text-ink font-medium">
                  {order.estimated_delivery_date
                    ? new Date(order.estimated_delivery_date).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })
                    : 'To be confirmed'}
                </span>
              </p>
              <p className="font-mono text-[11px] uppercase tracking-wide text-ink/30 mt-1">
                {order.delivery_method === 'pickup' ? 'Pickup at boutique' : 'Delivery to your address'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link
                to="/shop"
                className="bg-gold text-ink px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-[0.2em] hover:bg-gold-light active:scale-[0.97] animate-glow-pulse transition-all duration-300 text-center"
              >
                Continue Shopping
              </Link>
              {order.user_id && (
                <Link
                  to="/dashboard"
                  className="border border-gold/40 text-ink px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-ink active:scale-[0.97] transition-all duration-300 text-center"
                >
                  My Orders
                </Link>
              )}
            </div>
          </div>
        </Reveal>

        {/* Guest Account Prompt */}
        {isGuest && showAccountPrompt && (
          <Reveal delay={100} className="mt-6 bg-white border border-gold/30 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <p className="font-mono text-gold-dark uppercase text-[11px] tracking-[0.3em] mb-2">
                  For Next Time
                </p>
                <h3 className="text-xl font-display font-bold text-ink mb-3">
                  Create Your Account
                </h3>
                <p className="text-sm text-ink/60 mb-4">
                  Track your orders, get exclusive discounts, and enjoy faster checkout.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-ink/60">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-dark/70 flex-shrink-0" /> Order history & tracking
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-dark/70 flex-shrink-0" /> Faster checkout next time
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-dark/70 flex-shrink-0" /> Exclusive member discounts
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-dark/70 flex-shrink-0" /> Birthday offers
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
                <Link
                  to="/register"
                  state={{
                    from: 'guest',
                    orderId: order.id,
                    guestData: {
                      name: order.guest_name || '',
                      email: order.guest_email || '',
                      phone: order.guest_phone || ''
                    }
                  }}
                  className="bg-ink text-bone px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-ink active:scale-[0.97] transition-all duration-300 text-center"
                >
                  Create Account Free
                </Link>
                <button
                  onClick={() => setShowAccountPrompt(false)}
                  className="border border-ink/15 text-ink/50 px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-[0.2em] hover:border-ink/30 active:scale-[0.97] transition-all duration-300"
                >
                  No Thanks
                </button>
              </div>
            </div>
          </Reveal>
        )}

        {/* Guest Order Note */}
        {isGuest && (
          <p className="mt-5 text-center font-mono text-[11px] text-ink/40 tracking-wide">
            {order.guest_email
              ? `A confirmation email has been sent to ${order.guest_email}`
              : 'A confirmation email has been sent to your email address.'}
          </p>
        )}
      </div>
    </div>
  )
}

export default OrderConfirmation