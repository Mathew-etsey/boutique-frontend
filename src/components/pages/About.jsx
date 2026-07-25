import React from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok, FaSnapchat, FaWhatsapp } from 'react-icons/fa'
import logoGold from '../../assets/logo-gold.png'

const About = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://www.instagram.com/masterpiecegh.official',
      color: 'hover:text-pink-500'
    },
    {
      name: 'TikTok',
      icon: FaTiktok,
      url: 'https://www.tiktok.com/@masterpiece.gh_',
      color: 'hover:text-gray-300'
    },
    {
      name: 'Snapchat',
      icon: FaSnapchat,
      url: 'https://www.snapchat.com/add/masterpiece.gh',
      color: 'hover:text-yellow-400'
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: 'https://wa.me/233241234567',
      color: 'hover:text-green-500'
    }
  ]

  return (
    <div className="min-h-screen bg-bone py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img src={logoGold} alt="Masterpiece" className="h-20 w-auto" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-ink">
            About MASTERPIECE
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto mt-4"></div>
        </div>

        {/* Story */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-display font-semibold text-ink mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            MASTERPIECE is a curated fashion boutique born from a passion for timeless style and modern elegance. 
            We believe that fashion is more than just clothing—it's a statement of who you are.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every piece in our collection is carefully selected to help you wear your crown with confidence. 
            From Ghana to the world, we bring you fashion that tells a story.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-display font-semibold text-ink mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            To empower individuals to express their unique style through carefully curated fashion pieces 
            that blend quality, comfort, and elegance. We are committed to providing an exceptional shopping 
            experience that celebrates individuality and confidence.
          </p>
        </div>

        {/* Social Media Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-display font-semibold text-ink mb-4 text-center">
            Connect With Us
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Follow us on social media for updates, new arrivals, and exclusive offers.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 ${social.color}`}
              >
                <social.icon className="w-10 h-10" />
                <span className="text-sm font-medium text-gray-700">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Back to Shop */}
        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-block bg-gold text-ink px-8 py-3 rounded-full font-mono text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300"
          >
            Explore Our Collection
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About