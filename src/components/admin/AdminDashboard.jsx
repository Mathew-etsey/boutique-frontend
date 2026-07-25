import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const STATUS_STYLES = {
  completed: 'border-emerald-700/30 text-emerald-800 bg-emerald-700/5',
  cancelled: 'border-oxblood/30 text-oxblood bg-oxblood/5',
  pending: 'border-gold/40 text-gold-dark bg-gold/10',
}

const getStatusStyle = (status) => STATUS_STYLES[status] || 'border-ink/15 text-ink/60 bg-ink/5'

const AdminDashboard = () => {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    total_customers: 0,
    total_revenue: 0,
    pending_orders: 0,
    low_stock_products: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/')
      return
    }
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const statsResponse = await api.get('/admin/orders/statistics')

      const statsData = {
        total_products: 0,
        total_orders: Number(statsResponse.data.data.total_orders) || 0,
        total_customers: 0,
        total_revenue: Number(statsResponse.data.data.total_revenue) || 0,
        pending_orders: Number(statsResponse.data.data.pending_orders) || 0,
        low_stock_products: 0
      }

      setStats(statsData)

      const productsResponse = await api.get('/admin/products')
      const products = productsResponse.data.data || []
      const lowStock = products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0).length

      setStats(prev => ({
        ...prev,
        total_products: products.length,
        low_stock_products: lowStock
      }))

      const ordersResponse = await api.get('/admin/orders')
      setRecentOrders(ordersResponse.data.data.data?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  const statCards = [
    { title: 'Total Products', value: stats.total_products, icon: ShoppingBagIcon },
    { title: 'Total Orders', value: stats.total_orders, icon: ShoppingCartIcon },
    { title: 'Revenue', value: `GH₵ ${Number(stats.total_revenue || 0).toFixed(2)}`, icon: CurrencyDollarIcon },
    { title: 'Pending Orders', value: stats.pending_orders, icon: ClockIcon },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink">
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink/40">
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
            })}
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-ink/50 hover:text-gold-dark hover:bg-gold/10 rounded-full active:scale-90 transition"
            title="Refresh Dashboard"
          >
            <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white border border-ink/10 rounded-sm p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">{card.title}</p>
                <p className="text-2xl font-display font-bold text-ink mt-2">
                  {card.value}
                </p>
              </div>
              <div className="bg-ink p-3 rounded-sm">
                <card.icon className="w-5 h-5 text-gold" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(stats.low_stock_products > 0 || stats.pending_orders > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {stats.low_stock_products > 0 && (
            <div className="bg-white border border-gold/30 rounded-sm p-4 flex items-center gap-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-gold-dark flex-shrink-0" />
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-ink font-semibold">Low Stock Alert</p>
                <p className="text-sm text-ink/60 mt-0.5">
                  {stats.low_stock_products} product(s) are low on stock (≤ 5 items)
                </p>
              </div>
            </div>
          )}
          {stats.pending_orders > 0 && (
            <div className="bg-white border border-ink/15 rounded-sm p-4 flex items-center gap-4">
              <ClockIcon className="w-6 h-6 text-ink/60 flex-shrink-0" />
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-ink font-semibold">Pending Orders</p>
                <p className="text-sm text-ink/60 mt-0.5">
                  {stats.pending_orders} order(s) awaiting confirmation
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white border border-ink/10 rounded-sm p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-ink mb-4">
          Recent Orders
        </h2>
        {recentOrders.length === 0 ? (
          <p className="text-center py-8 font-mono text-sm text-ink/40">No recent orders</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink/10">
                    <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Order #</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Customer</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Total</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Status</th>
                    <th className="text-left py-3 px-4 font-mono text-[10px] uppercase tracking-wide text-ink/40">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-ink/5 hover:bg-bone/60 transition">
                      <td className="py-3 px-4 text-sm font-mono text-ink">{order.order_number}</td>
                      <td className="py-3 px-4 text-sm text-ink/70">{order.user?.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-sm font-mono text-gold-dark">GH₵ {order.total_amount}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block border rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${getStatusStyle(order.order_status)}`}>
                          {order.order_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-ink/40">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-ink/10 rounded-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-sm text-ink">{order.order_number}</span>
                    <span className={`inline-block border rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide ${getStatusStyle(order.order_status)}`}>
                      {order.order_status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-ink/70">{order.user?.name || 'Unknown'}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-mono text-sm text-gold-dark">GH₵ {order.total_amount}</span>
                    <span className="text-xs text-ink/40">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard