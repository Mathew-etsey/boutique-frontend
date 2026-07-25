import React from 'react'

const Seal = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <path d="M35 32 L41 42 L50 27 L59 42 L65 32 L62 47 L38 47 Z" fill="currentColor" />
      <text x="50" y="68" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="22" fontWeight="700" fill="currentColor">M</text>
      <text x="50" y="80" textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize="5.5" letterSpacing="3" fill="currentColor">MASTERPIECE</text>
    </svg>
  )
}

export default Seal