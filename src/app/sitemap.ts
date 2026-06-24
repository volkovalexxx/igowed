import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || 'https://igowed.by'

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/catalog`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/become`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]
}
