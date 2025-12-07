import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scriblepad.vercel.app'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/r/'], // Don't index individual room pages
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
