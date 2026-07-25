import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { UserPlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const AccountPrompt = () => {
  const { isAuthenticated } = useAuth()

  // Don't show if user is already logged in
  if (isAuthenticated()) {
    return null
  }

  return (
    <section className="bg-ink text-bone py-12 sm:py-16 border-y border-gold/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-5 animate-float">
          <UserPlusIcon className="w-7 h-7 text-gold" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-bone">
          Join the <span className="text-gold">MASTERPIECE</span> Community
        </h2>
        
        <p className="text-bone/60 text-sm sm:text-base mt-3 max-w-lg mx-auto">
          Create an account and get <span className="text-gold font-semibold">10% OFF</span> your first order. 
          Plus exclusive access to new arrivals and member-only offers.
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-5">
          <div className="flex items-center gap-2 text-sm text-bone/50">
            <CheckCircleIcon className="w-4 h-4 text-gold" />
            Order history & tracking
          </div>
          <div className="flex items-center gap-2 text-sm text-bone/50">
            <CheckCircleIcon className="w-4 h-4 text-gold" />
            Faster checkout
          </div>
          <div className="flex items-center gap-2 text-sm text-bone/50">
            <CheckCircleIcon className="w-4 h-4 text-gold" />
            Exclusive discounts
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <Link
            to="/register"
            className="bg-gold text-ink px-8 py-3.5 rounded-sm font-mono text-xs uppercase tracking-[0.2em] hover:bg-gold-light active:scale-[0.97] transition-all duration-300"
          >
            Create Account Free
          </Link>
          <Link
            to="/login"
            className="border border-gold/40 text-bone px-8 py-3.5 rounded-sm font-mono text-xs uppercase tracking-[0.2em] hover:bg-gold/10 active:scale-[0.97] transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AccountPrompt