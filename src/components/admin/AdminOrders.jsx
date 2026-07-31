import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending: 'border-gold/40 text-gold-dark bg-gold/10',
  payment_confirmed: 'border-ink/20 text-ink/70 bg-ink/5',
  processing: 'border-ink/20 text-ink/70 bg-ink/5',
  ready_for_pickup: 'border-ink/20 text-ink/70 bg-ink/5',
  completed: 'border-emerald-700/30 text-emerald-800 bg-emerald-700/5',
  cancelled: 'border-oxblood/30 text-oxblood bg-oxblood/5',
}

const getStatusStyle = (status) => STATUS_STYLES[status] || 'border-ink/15 text-ink/50 bg-ink/5'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const getCustomerName = (order) => {
  if (order.user?.name) {
    return order.user.name
  }
  if (order.guest_name) {
    return order.guest_name
  }
  return 'Unknown'
}

const getCustomerPhone = (order) => {
  if (order.user?.phone) {
    return order.user.phone
  }
  if (order.guest_phone) {
    return order.guest_phone
  }
  return 'N/A'
}

// ===== NEW: Get variation details from order items =====
const getVariationDetails = (order) => {
  if (!order.items || order.items.length === 0) return null
  
  const variations = order.items
    .filter(item => item.size || item.color)
    .map(item => {
      const parts = []
      if (item.size) parts.push(`Size: ${item.size}`)
      if (item.color) parts.push(`Color: ${item.color}`)
      return parts.join(' | ')
    })
    .filter(v => v.length > 0)
  
  return variations.length > 0 ? variations : null
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders')
      setOrders(response.data.data.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      await api.post(`/admin/orders/${orderId}/status`, { status })
      toast.success('Order status updated')
      fetchOrders()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const selectClass = "font-mono text-xs uppercase tracking-wide border border-ink/15 rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-gold transition w-full sm:w-auto"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading Orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl font-display font-bold text-ink">
          Orders Management
        </h1>
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink/50 border border-ink/15 px-3 py-1.5 rounded-full">
          Total: {orders.length} Orders
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white border border-ink/10 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bone border-b border-ink/10">
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Order #</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Customer</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Phone</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Items</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Total</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Status</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Date</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 font-mono text-sm text-ink/40">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const variationDetails = getVariationDetails(order)
                  
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="border-b border-ink/5 hover:bg-bone/60 transition cursor-pointer" onClick={() => toggleExpand(order.id)}>
                        <td className="py-3 px-4 font-mono text-sm text-ink whitespace-nowrap">{order.order_number}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">{getCustomerName(order)}</td>
                        <td className="py-3 px-4 text-sm text-ink/70 whitespace-nowrap">{getCustomerPhone(order)}</td>
                        <td className="py-3 px-4 text-sm text-ink/70">
                          {order.items && order.items.length > 0 ? (
                            <div>
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span>{item.product?.name || 'Product'}</span>
                                  <span className="text-ink/30">×</span>
                                  <span className="font-mono text-xs">{item.quantity}</span>
                                  {item.size && (
                                    <span className="text-[10px] font-mono bg-ink/5 px-1.5 py-0.5 rounded">
                                      {item.size}
                                    </span>
                                  )}
                                  {item.color && (
                                    <span className="text-[10px] font-mono bg-ink/5 px-1.5 py-0.5 rounded">
                                      {item.color}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-ink/30">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-gold-dark whitespace-nowrap">GH₵ {order.total_amount}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block border rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide whitespace-nowrap ${getStatusStyle(order.order_status)}`}>
                            {order.order_status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-ink/40 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <select
                            value={order.order_status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={selectClass}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      
                      {/* Expanded row showing variation details */}
                      {expandedOrder === order.id && variationDetails && variationDetails.length > 0 && (
                        <tr className="bg-bone/30">
                          <td colSpan="8" className="py-2 px-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-mono text-[10px] uppercase tracking-wide text-ink/40">Variations:</span>
                              {variationDetails.map((detail, idx) => (
                                <span key={idx} className="font-mono text-xs bg-white border border-ink/10 px-3 py-1 rounded-full">
                                  {detail}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile / tablet cards */}
      <div className="lg:hidden space-y-3">
        {orders.length === 0 ? (
          <p className="text-center py-10 font-mono text-sm text-ink/40">No orders found</p>
        ) : (
          orders.map((order) => {
            const variationDetails = getVariationDetails(order)
            
            return (
              <div key={order.id} className="bg-white border border-ink/10 rounded-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm text-ink">{order.order_number}</span>
                  <span className={`inline-block border rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${getStatusStyle(order.order_status)}`}>
                    {order.order_status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-ink/70">{getCustomerName(order)}</p>
                <p className="text-sm text-ink/50">{getCustomerPhone(order)}</p>
                
                {/* Order items with variations */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-ink/70">
                        <span>{item.product?.name || 'Product'}</span>
                        <span className="text-ink/30 mx-1">×</span>
                        <span className="font-mono text-xs">{item.quantity}</span>
                        {item.size && (
                          <span className="ml-2 text-[10px] font-mono bg-ink/5 px-2 py-0.5 rounded">Size: {item.size}</span>
                        )}
                        {item.color && (
                          <span className="ml-1 text-[10px] font-mono bg-ink/5 px-2 py-0.5 rounded">Color: {item.color}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-2 mb-3">
                  <span className="font-mono text-sm text-gold-dark">GH₵ {order.total_amount}</span>
                  <span className="text-xs text-ink/40">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <select
                  value={order.order_status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`${selectClass} w-full`}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AdminOrders