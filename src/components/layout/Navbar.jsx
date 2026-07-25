import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logoGold from '../../assets/logo-gold.png'

const Navbar = () => {
  const { cartCount } = useCart()
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLink = "relative text-bone/90 hover:text-gold transition-colors duration-200 text-xs tracking-[0.2em] uppercase after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink/95 backdrop-blur-md shadow-lg shadow-black/40' : 'bg-ink'}`}>
      <div className="h-[2px] bg-ink-soft">
        <div className="h-full bg-gold transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoGold} alt="Masterpiece" className="h-14 sm:h-16 w-auto object-contain" />
            <span className="hidden sm:block text-lg font-display font-bold tracking-[0.2em] text-bone">
              MASTERPIECE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-9">
            <Link to="/" className={navLink}>Home</Link>
            <Link to="/shop" className={navLink}>Shop</Link>
            <Link to="/about" className={navLink}>About</Link>

            <Link to="/cart" className="text-bone/90 hover:text-gold active:scale-90 transition relative">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated() ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-bone/90 hover:text-gold transition">
                  <UserIcon className="w-5 h-5" />
                  <span className="text-xs tracking-wide">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-3 w-52 bg-ink-soft border border-gold/20 rounded-lg shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {isAdmin() && (
                    <Link to="/admin" className="block px-4 py-3 text-sm text-bone/90 hover:bg-gold/10 hover:text-gold transition">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/dashboard" className="block px-4 py-3 text-sm text-bone/90 hover:bg-gold/10 hover:text-gold transition">
                    My Profile
                  </Link>
                  <Link to="/dashboard" className="block px-4 py-3 text-sm text-bone/90 hover:bg-gold/10 hover:text-gold transition">
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-950/30 border-t border-gold/10 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="border border-gold text-gold px-5 py-2 text-xs uppercase tracking-[0.2em] rounded-full hover:bg-gold hover:text-ink active:scale-95 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* ✅ MOBILE HEADER - Cart Icon + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Cart Icon on Mobile */}
            <Link to="/cart" className="relative text-bone hover:text-gold transition">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button 
              className="text-bone active:scale-90 transition-transform" 
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ MOBILE MENU - Cart also appears here */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-ink border-t border-gold/10 px-6 py-6 flex flex-col gap-5">
          <Link to="/" onClick={() => setMobileOpen(false)} className="text-bone uppercase text-xs tracking-[0.2em]">Home</Link>
          <Link to="/shop" onClick={() => setMobileOpen(false)} className="text-bone uppercase text-xs tracking-[0.2em]">Shop</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="text-bone uppercase text-xs tracking-[0.2em]">About</Link>
          
          {/* ✅ Cart in mobile menu too */}
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="text-bone uppercase text-xs tracking-[0.2em] flex items-center justify-between">
            Cart
            {cartCount > 0 && (
              <span className="bg-gold text-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated() ? (
            <>
              {isAdmin() && (
                <Link 
                  to="/admin" 
                  onClick={() => setMobileOpen(false)} 
                  className="text-gold uppercase text-xs tracking-[0.2em]"
                >
                  ⚡ Admin Dashboard
                </Link>
              )}
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-bone uppercase text-xs tracking-[0.2em]">My Account</Link>
              <button onClick={handleLogout} className="text-left text-red-400 uppercase text-xs tracking-[0.2em]">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gold uppercase text-xs tracking-[0.2em]">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar