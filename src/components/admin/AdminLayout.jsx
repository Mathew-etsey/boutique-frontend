import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  ArrowLeftIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import logoGold from '../../assets/logo-gold.png'

const AdminLayout = () => {
  const location = useLocation()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: HomeIcon },
    { path: '/admin/products', label: 'Products', icon: ShoppingBagIcon },
    { path: '/admin/orders', label: 'Orders', icon: TagIcon },
    { path: '/admin/categories', label: 'Categories', icon: UsersIcon },
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-bone">
      {/* Mobile Header */}
      <div className="lg:hidden bg-ink sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-gold/10">
        <Link to="/admin" className="flex items-center gap-2.5">
          <img src={logoGold} alt="Masterpiece" className="h-9 w-auto object-contain" />
          <span className="font-display font-bold text-bone tracking-widest text-sm">MASTERPIECE</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-bone hover:bg-gold/10 active:scale-90 transition"
        >
          {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-64 bg-ink min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b border-gold/10">
            <Link to="/admin" className="flex items-center gap-3">
              <img src={logoGold} alt="Masterpiece" className="h-12 w-auto object-contain" />
              <span className="font-display font-bold text-bone tracking-widest text-base"></span>
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold/60 mt-3">Admin Panel</p>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-mono tracking-wide uppercase text-xs transition-all duration-300 active:scale-[0.98] ${
                  isActive(item.path)
                    ? 'bg-gold text-ink'
                    : 'text-bone/70 hover:bg-gold/10 hover:text-gold'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}

            <Link
              to="/"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-mono uppercase tracking-wide text-bone/60 hover:bg-gold/10 hover:text-gold transition mt-4 border-t border-gold/10 pt-4 active:scale-[0.98]"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Site
            </Link>

            <button
              onClick={() => {
                logout()
                closeSidebar()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-mono uppercase tracking-wide text-oxblood hover:bg-oxblood/10 transition active:scale-[0.98]"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-ink/60 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout