import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getImageUrl } from '../../services/api'
import MarqueeTicker from '../common/MarqueeTicker'
import Reveal from '../common/Reveal'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import heroBg from '../../assets/hero-bg.jpg'
import logoGold from '../../assets/logo-gold.png'

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          api.get('/public/featured'),
          api.get('/public/new-arrivals')
        ])
        setFeatured(featuredRes.data.data?.slice(0, 4) || [])
        setNewArrivals(newRes.data.data?.slice(0, 4) || [])
        setLoading(false)
      } catch (error) {
        console.error('API Error:', error)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="bg-bone min-h-screen">
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[560px] overflow-hidden bg-ink">
        <img
          src={heroBg}
          alt="Masterpiece"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full bg-ink/50 blur-3xl" />

          <img
            src={logoGold}
            alt="Masterpiece"
            className="relative w-40 sm:w-52 md:w-60 h-auto object-contain animate-float drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          />

          <p className="relative font-mono text-[10px] sm:text-xs tracking-[0.4em] text-gold/90 mt-6 animate-fade-up">
            EST. GHANA — WEAR YOUR CROWN
          </p>

          <Link
            to="/shop"
            className="relative group inline-flex items-center gap-3 bg-gold text-ink font-mono text-xs tracking-[0.2em] uppercase px-7 py-4 rounded-full mt-8 hover:bg-gold-light active:scale-95 animate-glow-pulse transition-all duration-300"
          >
            Shop The Collection
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      <MarqueeTicker />

      {/* ===== FEATURED PRODUCTS GRID (4 products) ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Reveal className="text-center mb-12 sm:mb-16">
          <span className="font-mono text-gold-dark uppercase text-[11px] tracking-[0.35em]">Curated Picks</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-ink mt-2">
            Featured Pieces
          </h2>
          <p className="text-ink/50 text-sm mt-2 max-w-lg mx-auto">
            Handpicked for those who wear their crown with confidence
          </p>
        </Reveal>

        {loading ? (
          <p className="text-center font-mono text-sm text-ink/50">Loading...</p>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
            {featured.map((product, index) => {
              const imageUrl = getImageUrl(product.images?.[0]?.image_url)

              return (
                <Reveal key={product.id} delay={index * 70}>
                  <Link
                    to={`/product/${product.id}`}
                    className="group block bg-white border border-ink/10 hover:border-gold/30 hover:-translate-y-1 active:scale-[0.98] hover:shadow-xl transition-all duration-500 rounded-sm overflow-hidden"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink/20 text-sm">
                          No image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="block bg-gold text-ink text-center text-[10px] font-mono tracking-[0.2em] uppercase py-2 rounded-full">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-display text-ink text-sm leading-tight line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gold font-bold text-sm sm:text-base mt-1">
                        GH₵ {product.price}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        ) : (
          <p className="text-center font-mono text-sm text-ink/50">No featured products yet</p>
        )}

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-block border-2 border-gold text-gold px-8 py-3 rounded-full font-mono text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-ink transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* ===== "FOCUS ON DETAILS" SECTION ===== */}
      <section className="bg-ink text-bone py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-square bg-ink-soft rounded-lg overflow-hidden border border-gold/20">
                <img
                  src="/images/focus-details.jpg"
                  alt="Focus on Details"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-gold/20 text-gold text-[10px] font-mono tracking-[0.3em] uppercase px-3 py-1 rounded-full">
                    Premium Quality
                  </span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="font-mono text-gold text-[11px] tracking-[0.35em] uppercase">
                Focus On Details
              </span>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-bone mt-3 leading-tight">
                Signature Artistry
              </h3>
              <p className="text-bone/60 text-sm sm:text-base mt-4 leading-relaxed">
                Our signature collection serves as a wearable canvas. Every element is refined, focusing on high-end quality, material longevity, and architectural silhouette design.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gold text-sm mt-0.5">✦</span>
                  <div>
                    <h4 className="text-sm font-medium text-bone">Premium Heavyweight Cotton</h4>
                    <p className="text-bone/40 text-xs">100% long-staple combed cotton at 280GSM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold text-sm mt-0.5">✦</span>
                  <div>
                    <h4 className="text-sm font-medium text-bone">High-Density Graphic Print</h4>
                    <p className="text-bone/40 text-xs">Embossed, tactile 3D dimension</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold text-sm mt-0.5">✦</span>
                  <div>
                    <h4 className="text-sm font-medium text-bone">Double-Needle Mock Neck</h4>
                    <p className="text-bone/40 text-xs">Shape-retaining ribbed collar for a modern silhouette</p>
                  </div>
                </div>
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-mono text-xs tracking-[0.2em] uppercase mt-6 transition-colors group"
              >
                Explore Collection
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS (4 products) ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Reveal className="text-center mb-12 sm:mb-16">
          <span className="font-mono text-gold-dark uppercase text-[11px] tracking-[0.35em]">Fresh In</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-ink mt-2">
            New Arrivals
          </h2>
        </Reveal>

        {loading ? (
          <p className="text-center font-mono text-sm text-ink/50">Loading...</p>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
            {newArrivals.map((product, index) => {
              const imageUrl = getImageUrl(product.images?.[0]?.image_url)

              return (
                <Reveal key={product.id} delay={index * 70}>
                  <Link
                    to={`/product/${product.id}`}
                    className="group block bg-white border border-ink/10 hover:border-gold/30 hover:-translate-y-1 active:scale-[0.98] hover:shadow-xl transition-all duration-500 rounded-sm overflow-hidden"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink/20 text-sm">
                          No image
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="block bg-gold text-ink text-center text-[10px] font-mono tracking-[0.2em] uppercase py-2 rounded-full">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-display text-ink text-sm leading-tight line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gold font-bold text-sm sm:text-base mt-1">
                        GH₵ {product.price}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        ) : (
          <p className="text-center font-mono text-sm text-ink/50">No new arrivals yet</p>
        )}

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-block border-2 border-gold text-gold px-8 py-3 rounded-full font-mono text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-ink transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* ===== CURATED OUTFIT SECTION ===== */}
      <section className="bg-ink text-bone py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="font-mono text-gold text-[11px] tracking-[0.35em] uppercase">
                Curated Outfit
              </span>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-bone mt-3 leading-tight">
                The Monochrome Set
              </h3>
              <p className="text-bone/60 text-sm sm:text-base mt-4 leading-relaxed">
                Unlock absolute cohesion with our summer uniform. Each garment is dye-matched to create a unified aesthetic profile that is both effortless and sophisticated.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gold text-sm mt-0.5">✦</span>
                  <div>
                    <h4 className="text-sm font-medium text-bone">Tailored Black Shorts</h4>
                    <p className="text-bone/40 text-xs">Adjustable drawcord, reinforced deep side pockets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gold text-sm mt-0.5">✦</span>
                  <div>
                    <h4 className="text-sm font-medium text-bone">Boxy Drop Silhouette</h4>
                    <p className="text-bone/40 text-xs">Above-the-knee design for everyday versatility</p>
                  </div>
                </div>
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gold text-ink px-6 py-3 rounded-full font-mono text-xs tracking-[0.2em] uppercase hover:bg-gold-light transition-all mt-6 group"
              >
                Shop The Look
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative aspect-square bg-ink-soft rounded-lg overflow-hidden border border-gold/20">
              <img
                src="/images/curated-outfit.jpg"
                alt="Curated Outfit"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <span className="inline-block bg-gold/20 text-gold text-[10px] font-mono tracking-[0.3em] uppercase px-3 py-1 rounded-full">
                  The Set
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="bg-gold py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink">
            Ready to Elevate Your Style?
          </h3>
          <p className="text-ink/70 text-sm sm:text-base mt-3 max-w-lg mx-auto">
            Explore our curated collection of premium fashion pieces designed for those who wear their crown with confidence.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-ink text-bone px-8 py-3 rounded-full font-mono text-xs tracking-[0.2em] uppercase hover:bg-ink/80 transition-all mt-6"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home