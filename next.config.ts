import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'www.topcv.vn'
         }
      ]
   }
}

export default nextConfig
