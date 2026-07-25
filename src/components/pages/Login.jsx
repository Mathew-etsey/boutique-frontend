import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PasswordInput from '../common/PasswordInput'
import logoWhite from '../../assets/logo-white.png'
import loginBg from '../../assets/login-bg.jpg'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bone">
      {/* BRAND PANEL — photo band on mobile, full split-screen on desktop */}
      <div className="relative w-full h-[38vh] lg:h-auto lg:w-1/2 bg-ink overflow-hidden">
        <img
          src={loginBg}
          alt="Masterpiece"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50 lg:bg-gradient-to-t lg:from-ink lg:via-ink/40 lg:to-ink/30" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center lg:items-start lg:justify-between p-8 lg:p-12 text-center lg:text-left">
          <Link to="/" className="flex items-center gap-3 w-fit animate-fade-up">
            <img src={logoWhite} alt="Masterpiece" className="h-12 lg:h-14 w-auto object-contain animate-float" />
          </Link>

          <div className="hidden lg:block animate-fade-up" style={{ animationDelay: '150ms' }}>
            <p className="font-mono text-[11px] tracking-[0.4em] text-gold/80 mb-4">
              EST. GHANA — WEAR YOUR CROWN
            </p>
            <h2 className="font-display font-bold text-bone text-4xl leading-tight max-w-md">
              Every account holds a seat at the collection.
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
          <div className="mb-10 animate-fade-up">
            <span className="font-mono text-gold-dark uppercase text-[11px] tracking-[0.35em]">Welcome Back</span>
            <h1 className="text-3xl font-display font-bold text-ink mt-2">Sign In</h1>
            <p className="text-ink/50 text-sm mt-2">Access your account and order history.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
              <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-ink/20 pb-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold transition-colors duration-300"
                placeholder="you@example.com"
              />
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
              <label className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-2">
                Password
              </label>
              <PasswordInput
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end animate-fade-up" style={{ animationDelay: '200ms' }}>
              <Link to="/forgot-password" className="font-mono text-[11px] tracking-wide text-gold-dark hover:text-gold active:text-gold transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-bone py-4 font-mono text-xs uppercase tracking-[0.25em] hover:bg-gold hover:text-ink active:scale-[0.97] animate-glow-pulse transition-all duration-300 disabled:opacity-50 disabled:animate-none rounded-sm animate-fade-up"
              style={{ animationDelay: '260ms' }}
            >
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="font-mono text-[10px] text-ink/30 tracking-widest">NEW HERE</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <Link
            to="/register"
            className="block w-full text-center border border-gold/50 text-ink py-4 font-mono text-xs uppercase tracking-[0.25em] hover:border-gold hover:text-gold-dark active:scale-[0.97] transition-all duration-300 rounded-sm"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login