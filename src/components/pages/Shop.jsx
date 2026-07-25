import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import Reveal from '../common/Reveal'
import ProductCard from '../common/ProductCard'
import PageTitle from '../common/PageTitle'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/public/products')
        setProducts(response.data.data || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold border-t-transparent mx-auto"></div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading Collection...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageTitle 
        title="Shop"
        description="Explore our full collection of premium fashion pieces."
      />
      <div className="min-h-screen bg-bone">
        {/* PAGE HEADER */}
        <div className="bg-ink border-b border-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.4em] text-gold/80 mb-4 animate-fade-up">
              THE FULL RANGE
            </p>
            <h1
              className="font-display font-bold text-bone text-4xl sm:text-5xl tracking-tight animate-fade-up"
              style={{ animationDelay: '100ms' }}
            >
              Our Collection
            </h1>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {products.length === 0 ? (
            <p className="text-center font-mono text-sm text-ink/50">No products available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
              {products.map((product, index) => (
                <Reveal key={product.id} delay={index * 60}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Shop