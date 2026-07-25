import React, { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide button when scrolling down, show when scrolling up
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => {
      window.removeEventListener('scroll', controlNavbar)
    }
  }, [lastScrollY])

  // Replace with the client's actual WhatsApp number
  const phoneNumber = '233204082142' // Ghana number without the + sign
  const message = 'Hello! I have a question about your products.'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-8 h-8 text-white" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 whitespace-nowrap bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </a>

      {/* Badge - Shows "Online" */}
      <div className="absolute -top-1 -right-1 bg-green-400 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
        
      </div>
    </div>
  )
}

export default WhatsAppButton