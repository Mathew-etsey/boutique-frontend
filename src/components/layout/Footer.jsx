import React from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaSnapchat, FaWhatsapp } from 'react-icons/fa'
import logoWhite from '../../assets/logo-white.png'

const SOCIALS = [
  { name: 'Instagram', url: 'https://www.instagram.com/masterpiecegh.official', icon: FaInstagram },
  { name: 'TikTok', url: 'https://www.tiktok.com/@masterpiece.gh_', icon: FaTiktok },
  { name: 'Snapchat', url: 'https://www.snapchat.com/add/masterpiece.gh', icon: FaSnapchat },
  { name: 'WhatsApp', url: 'https://wa.me/233204082142', icon: FaWhatsapp },
]

const Footer = () => {
  return (
    <footer className="bg-ink text-bone mt-auto border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoWhite} alt="Masterpiece" className="h-14 w-auto object-contain" />
              <span className="text-2xl font-display font-bold tracking-widest">MASTERPIECE</span>
            </div>
            <p className="text-bone/60 text-sm max-w-sm leading-relaxed">
              Curated fashion pieces made for those who wear their crown with confidence.
              Timeless style, modern edge.
            </p>
          </div>

          <div>
            <h4 className="text-gold uppercase text-xs tracking-[0.25em] mb-4">Explore</h4>
            <ul className="space-y-3 text-sm text-bone/70">
              <li><Link to="/" className="hover:text-gold transition">Home</Link></li>
              <li><Link to="/shop" className="hover:text-gold transition">Shop</Link></li>
              <li><Link to="/cart" className="hover:text-gold transition">Cart</Link></li>
              <li><Link to="/dashboard" className="hover:text-gold transition">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold uppercase text-xs tracking-[0.25em] mb-4">Follow Us</h4>
            <div className="flex items-center gap-4">
              {SOCIALS.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-bone hover:bg-gold hover:text-ink active:scale-90 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-12 pt-6 text-center">
          <p className="text-xs text-bone/40 tracking-wide font-mono">
            &copy; {new Date().getFullYear()} MasterpieceGH. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer