import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   // Enable standalone output for Docker deployment
   output: 'standalone',

   // Ignore ESLint errors during build (for Docker deployment)
   eslint: {
      ignoreDuringBuilds: true
   },

   // Ignore TypeScript errors during build (for Docker deployment)
   typescript: {
      ignoreBuildErrors: true
   },

   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'www.topcv.vn'
         },
         {
            protocol: 'https',
            hostname: 'res.cloudinary.com'
         }
      ]
   }
}

export default nextConfig
