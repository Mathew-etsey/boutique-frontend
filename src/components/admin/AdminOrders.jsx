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

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

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
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Total</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Status</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Date</th>
                <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 font-mono text-sm text-ink/40">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-ink/5 hover:bg-bone/60 transition">
                    <td className="py-3 px-4 font-mono text-sm text-ink whitespace-nowrap">{order.order_number}</td>
                    <td className="py-3 px-4 text-sm text-ink/70">{order.user?.name || order.guest_name || 'Unknown'}</td>
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
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
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
          orders.map((order) => (
            <div key={order.id} className="bg-white border border-ink/10 rounded-sm p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm text-ink">{order.order_number}</span>
                <span className={`inline-block border rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${getStatusStyle(order.order_status)}`}>
                  {order.order_status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-ink/70">{order.user?.name || order.guest_name || 'Unknown'}</p>
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
          ))
        )}
      </div>
    </div>
  )
}

export default AdminOrders