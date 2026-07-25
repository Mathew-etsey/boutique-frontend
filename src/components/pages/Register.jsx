import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PasswordInput from '../common/PasswordInput'
import logoWhite from '../../assets/logo-white.png'
import registerBg from '../../assets/login-bg.jpg'
import PageTitle from '../common/PageTitle'

const Register = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)

  // Get guest data from location state (from order confirmation)
  const guestData = location.state?.guestData || {}

  const [formData, setFormData] = useState({
    name: guestData.name || '',
    email: guestData.email || '',
    phone: guestData.phone || '',
    password: '',
    password_confirmation: ''
  })

  // Pre-fill form with guest data if available
  useEffect(() => {
    if (guestData.name || guestData.email || guestData.phone) {
      setFormData(prev => ({
        ...prev,
        name: guestData.name || prev.name,
        email: guestData.email || prev.email,
        phone: guestData.phone || prev.phone
      }))
    }
  }, [guestData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { name, email, phone, password, password_confirmation } = formData
    const result = await register(name, email, phone, password, password_confirmation)
    setLoading(false)

    if (result.success) {
      // If coming from guest checkout, redirect to dashboard
      if (location.state?.from === 'guest') {
        navigate('/dashboard')
      } else {
        navigate('/')
      }
    }
  }

  return (
    <>
      <PageTitle 
        title="Register"
        description="Create your MASTERPIECE account."
      />
      <div className="min-h-screen flex flex-col lg:flex-row bg-bone">
        {/* BRAND PANEL — photo band on mobile, full split-screen on desktop */}
        <div className="relative w-full h-[32vh] lg:h-auto lg:w-1/2 bg-ink overflow-hidden">
          <img
            src={registerBg}
            alt="Masterpiece"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50 lg:bg-gradient-to-t lg:from-ink lg:via-ink/40 lg:to-ink/30" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center lg:items-start lg:justify-between p-8 lg:p-12 text-center lg:text-left">
            <Link to="/" className="flex items-center gap-3 w-fit animate-fade-up">
              <img src={logoWhite} alt="Masterpiece" className="h-11 lg:h-14 w-auto object-contain animate-float" />
            </Link>

            <div className="hidden lg:block animate-fade-up" style={{ animationDelay: '150ms' }}>
              <p className="font-mono text-[11px] tracking-[0.4em] text-gold/80 mb-4">
                EST. GHANA — WEAR YOUR CROWN
              </p>
              <h2 className="font-display font-bold text-bone text-4xl leading-tight max-w-md">
                Join the collection. Wear your crown from day one.
              </h2>
            </div>

            <p className="lg:hidden font-mono text-[10px] tracking-[0.35em] text-gold/80 mt-4 animate-fade-up" style={{ animationDelay: '150ms' }}>
              WEAR YOUR CROWN
            </p>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-8 animate-fade-up">
              <span className="font-mono text-gold-dark uppercase text-[11px] tracking-[0.35em]">Join Us</span>
              <h1 className="text-3xl font-display font-bold text-ink mt-2">Create Account</h1>
              <p className="text-ink/50 text-sm mt-2">Enjoy exclusive benefits as a member.</p>
            </div>

            {!location.state?.from && (
              <div className="border border-gold/30 rounded-sm px-4 py-3 mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
                <p className="font-mono text-[11px] text-ink/70 text-center tracking-wide">
                  GET <span className="text-gold-dark font-bold">10% OFF</span> YOUR FIRST ORDER
                </p>
              </div>
            )}

            {location.state?.from === 'guest' && (
              <div className="border border-emerald-700/30 bg-emerald-700/5 rounded-sm px-4 py-3 mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
                <p className="font-mono text-[11px] text-emerald-800 text-center tracking-wide">
                  WELCOME — TRACK YOUR ORDER #{location.state?.orderId}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-fade-up" style={{ animationDelay: '90ms' }}>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-ink/20 pb-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors duration-300"
                  placeholder="John Doe"
                />
              </div>

              <div className="animate-fade-up" style={{ animationDelay: '140ms' }}>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-ink/20 pb-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors duration-300"
                  placeholder="you@example.com"
                />
              </div>

              <div className="animate-fade-up" style={{ animationDelay: '190ms' }}>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-ink/20 pb-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors duration-300"
                  placeholder="0244123456"
                />
              </div>

              <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
                  Password
                </label>
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="animate-fade-up" style={{ animationDelay: '290ms' }}>
                <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
                  Confirm Password
                </label>
                <PasswordInput
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-bone py-4 font-mono text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-ink active:scale-[0.97] animate-glow-pulse transition-all duration-300 disabled:opacity-50 disabled:animate-none rounded-sm animate-fade-up"
                style={{ animationDelay: '340ms' }}
              >
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-ink/50">
                Already have an account?{' '}
                <Link to="/login" className="text-gold-dark hover:text-gold active:text-gold font-medium transition">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-ink/10">
              <p className="text-[11px] font-mono text-ink/40 text-center tracking-wide">
                BY CREATING AN ACCOUNT, YOU AGREE TO OUR TERMS &amp; CONDITIONS
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-3 text-[10px] font-mono text-ink/30 tracking-wide">
                <span>EXCLUSIVE MEMBER OFFERS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register