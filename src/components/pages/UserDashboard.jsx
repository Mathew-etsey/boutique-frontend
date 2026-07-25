import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'
import PageTitle from '../common/PageTitle'
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import Reveal from '../common/Reveal'

const STATUS_STYLES = {
  pending: { style: 'border-gold/40 text-gold-dark bg-gold/10', icon: ClockIcon },
  payment_confirmed: { style: 'border-ink/20 text-ink/70 bg-ink/5', icon: CheckCircleIcon },
  processing: { style: 'border-ink/20 text-ink/70 bg-ink/5', icon: TruckIcon },
  ready_for_pickup: { style: 'border-ink/20 text-ink/70 bg-ink/5', icon: CheckCircleIcon },
  completed: { style: 'border-emerald-700/30 text-emerald-800 bg-emerald-700/5', icon: CheckCircleIcon },
  cancelled: { style: 'border-oxblood/30 text-oxblood bg-oxblood/5', icon: XCircleIcon },
}

const inputClass = "w-full bg-transparent border-b border-ink/20 pb-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors duration-300"

const UserDashboard = () => {
  const { user, setUser } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  })
  const [profileLoading, setProfileLoading] = useState(false)

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/customer/orders')
      setOrders(response.data.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)

    try {
      const response = await api.put('/customer/profile', profileData)
      if (response.data.success) {
        toast.success('Profile updated successfully!')
        const updatedUser = { ...user, ...profileData }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordLoading(true)

    try {
      const response = await api.put('/customer/password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      })
      if (response.data.success) {
        toast.success('Password changed successfully!')
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const info = STATUS_STYLES[status] || STATUS_STYLES.pending
    const Icon = info.icon
    return (
      <span className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${info.style}`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ')}
      </span>
    )
  }

  const tabs = [
    { key: 'orders', label: 'Orders', icon: ShoppingBagIcon, count: orders.length },
    { key: 'profile', label: 'Profile', icon: UserIcon },
    { key: 'wishlist', label: 'Wishlist', icon: HeartIcon },
  ]

  if (loading) {
    return (
      <>
        <PageTitle 
          title="Dashboard"
          description="Manage your MASTERPIECE account and orders."
        />
        <div className="min-h-screen bg-bone flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent mx-auto"></div>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading Dashboard...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageTitle 
        title="Dashboard"
        description="Manage your MASTERPIECE account and orders."
      />
      <div className="min-h-screen bg-bone py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Sidebar (desktop) / Header + tab bar (mobile) */}
            <div className="md:w-64 flex-shrink-0">
              <Reveal className="bg-white border border-ink/10 md:sticky md:top-24">
                <div className="flex items-center gap-4 md:flex-col md:text-center p-5 md:p-6 border-b border-ink/10">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border border-gold/40 flex items-center justify-center flex-shrink-0 md:mx-auto md:mb-3">
                    <UserIcon className="w-7 h-7 md:w-10 md:h-10 text-gold-dark" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-ink">{user?.name}</h3>
                    <p className="text-sm text-ink/50">{user?.email}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-ink/30 mt-1">{user?.role}</p>
                  </div>
                </div>

                {/* Mobile: horizontal scroll tabs */}
                <nav className="flex md:hidden overflow-x-auto gap-2 p-3">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-wide whitespace-nowrap transition-all duration-300 active:scale-95 ${
                        activeTab === tab.key
                          ? 'bg-gold text-ink'
                          : 'border border-ink/15 text-ink/60'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={activeTab === tab.key ? 'text-ink/70' : 'text-ink/30'}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                {/* Desktop: vertical sidebar */}
                <nav className="hidden md:block space-y-1 p-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-mono text-xs uppercase tracking-wide transition-all duration-300 active:scale-[0.98] ${
                        activeTab === tab.key
                          ? 'bg-gold text-ink'
                          : 'text-ink/60 hover:bg-gold/10 hover:text-gold-dark'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`ml-auto ${activeTab === tab.key ? 'text-ink/70' : 'text-ink/30'}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </Reveal>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {activeTab === 'orders' && (
                <Reveal delay={60} className="bg-white border border-ink/10 p-5 sm:p-7">
                  <h2 className="text-xl font-display font-bold text-ink mb-6">
                    My Orders
                  </h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-14">
                      <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-4 animate-float">
                        <ShoppingBagIcon className="w-6 h-6 text-gold-dark" />
                      </div>
                      <p className="text-ink/50 text-sm mb-3">You haven't placed any orders yet</p>
                      <Link to="/shop" className="font-mono text-xs uppercase tracking-[0.2em] text-gold-dark hover:text-gold transition">
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order, index) => (
                        <Reveal key={order.id} delay={index * 50}>
                          <Link
                            to={`/order-confirmation/${order.id}`}
                            className="block border border-ink/10 rounded-sm p-4 sm:p-5 hover:border-gold/40 hover:bg-bone/40 active:scale-[0.99] transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <p className="font-mono text-sm text-ink">{order.order_number}</p>
                                  {getStatusBadge(order.order_status)}
                                </div>
                                <p className="text-xs text-ink/40 mt-2">
                                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                  })}
                                  {' · '}{order.items?.length || 0} items
                                </p>
                              </div>
                              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                <p className="font-mono text-gold-dark font-bold">GH₵ {order.total_amount}</p>
                                <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-ink/50">
                                  Details
                                  <ArrowRightIcon className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </Reveal>
                      ))}
                    </div>
                  )}
                </Reveal>
              )}

              {activeTab === 'profile' && (
                <Reveal delay={60} className="bg-white border border-ink/10 p-5 sm:p-7">
                  <h2 className="text-xl font-display font-bold text-ink mb-6">
                    Profile Settings
                  </h2>

                  <div className="space-y-8">
                    {/* Profile Information */}
                    <div>
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/40">Full Name</label>
                          <p className="text-ink mt-1">{user?.name}</p>
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/40">Email</label>
                          <p className="text-ink mt-1">{user?.email}</p>
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/40">Phone</label>
                          <p className="text-ink mt-1">{user?.phone || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wide text-ink/40">Role</label>
                          <p className="text-ink mt-1 capitalize">{user?.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Update Profile Form */}
                    <div className="border-t border-ink/10 pt-8">
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40 mb-4">Update Information</h3>
                      <form onSubmit={handleProfileSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">Name</label>
                            <input
                              type="text"
                              name="name"
                              value={profileData.name}
                              onChange={handleProfileChange}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">Phone</label>
                            <input
                              type="tel"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              className={inputClass}
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={profileLoading}
                          className="bg-ink text-bone px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-[0.15em] hover:bg-gold hover:text-ink active:scale-[0.97] transition-all duration-300 disabled:opacity-50"
                        >
                          {profileLoading ? 'Updating...' : 'Update Profile'}
                        </button>
                      </form>
                    </div>

                    {/* Change Password */}
                    <div className="border-t border-ink/10 pt-8">
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40 mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-sm">
                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">Current Password</label>
                          <input
                            type="password"
                            name="current_password"
                            value={passwordData.current_password}
                            onChange={handlePasswordChange}
                            className={inputClass}
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">New Password</label>
                          <input
                            type="password"
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            className={inputClass}
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            name="new_password_confirmation"
                            value={passwordData.new_password_confirmation}
                            onChange={handlePasswordChange}
                            className={inputClass}
                            placeholder="••••••••"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={passwordLoading}
                          className="bg-ink text-bone px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-[0.15em] hover:bg-gold hover:text-ink active:scale-[0.97] transition-all duration-300 disabled:opacity-50"
                        >
                          {passwordLoading ? 'Changing...' : 'Change Password'}
                        </button>
                      </form>
                    </div>
                  </div>
                </Reveal>
              )}

              {activeTab === 'wishlist' && (
                <Reveal delay={60} className="bg-white border border-ink/10 p-5 sm:p-7">
                  <h2 className="text-xl font-display font-bold text-ink mb-6">My Wishlist</h2>
                  <div className="text-center py-14">
                    <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-4 animate-float">
                      <HeartIcon className="w-6 h-6 text-gold-dark" />
                    </div>
                    <p className="text-ink/50 text-sm">Your wishlist is empty</p>
                    <Link to="/shop" className="font-mono text-xs uppercase tracking-[0.2em] text-gold-dark hover:text-gold mt-3 inline-block transition">
                      Browse Products →
                    </Link>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDashboard