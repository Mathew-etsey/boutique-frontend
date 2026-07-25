import React from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../services/api'

const STOCK_STYLES = {
  in_stock: { dot: 'bg-emerald-700', text: 'text-ink/50' },
  low_stock: { dot: 'bg-gold-dark', text: 'text-oxblood' },
  out_of_stock: { dot: 'bg-ink/30', text: 'text-ink/30' },
}

const ProductCard = ({ product }) => {
  // ✅ Use the helper function from api.js
  const imageUrl = product.images && product.images.length > 0
    ? getImageUrl(product.images[0].image_url)
    : null

  const stock = product.stock_status
  const stockStyle = stock ? (STOCK_STYLES[stock.status] || STOCK_STYLES.in_stock) : null

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white border border-ink/10 hover:border-gold/40 hover:-translate-y-1 active:scale-[0.98] hover:shadow-2xl hover:shadow-ink/10 transition-all duration-500 rounded-sm"
    >
      <div className="p-3">
        <div className="relative overflow-hidden aspect-[4/5] bg-ink/5">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover scale-100 group-hover:scale-[1.06] transition-transform duration-[1200ms] ease-out"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'
              }}
            />
          )}

          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-500" />

          <span className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute bottom-4 inset-x-0 flex justify-center translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <span className="bg-bone/95 text-ink px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase rounded-full shadow-md">
              View Details
            </span>
          </div>
        </div>

        <div className="pt-4 pb-1">
          <h3 className="font-display text-ink text-[1.05rem] leading-snug line-clamp-1">
            {product.name}
          </h3>

          <div className="inline-flex items-center gap-2 border border-gold/40 rounded-full pl-1.5 pr-3 py-1 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-dark/70" />
            <span className="font-mono text-xs text-ink tracking-wide">GH₵ {product.price}</span>
          </div>

          {stock && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`w-1.5 h-1.5 rounded-full ${stockStyle.dot}`} />
              <span className={`font-mono text-[10px] tracking-wide ${stockStyle.text}`}>
                {stock.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard