import React from 'react'
import { Helmet } from 'react-helmet-async'

const PageTitle = ({ title, description, image, url }) => {
  const siteName = 'MasterpieceGH'
  const defaultImage = 'https://onlineshoppingboutique-production.up.railway.app/images/logos/logo-gold.png'
  const defaultUrl = 'https://boutique-frontend-production.up.railway.app'

  const pageTitle = title ? `${title} | ${siteName}` : siteName
  const pageDescription = description || 'Curated fashion pieces made for those who wear their crown with confidence.'

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  )
}

export default PageTitle