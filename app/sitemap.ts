import { MetadataRoute } from 'next'

// Replace with your actual deployed URL
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scriblepad.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        // Note: Dynamic room pages (/r/[roomId]) are not included in sitemap
        // because they are user-generated content and shouldn't be indexed
    ]
}
