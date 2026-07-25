import React from 'react'

const ITEMS = ['NEW ARRIVALS', 'WEAR YOUR CROWN',  'MASTERPIECE GH']

const MarqueeTicker = () => {
  const loop = [...ITEMS, ...ITEMS]
  return (
    <div className="bg-ink border-y border-gold/20 overflow-hidden py-3">
      <div className="flex w-max animate-marquee">
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-gold/80 px-6 whitespace-nowrap"
          >
            {item} <span className="text-gold/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default MarqueeTicker