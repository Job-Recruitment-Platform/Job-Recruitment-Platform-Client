'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '@/types/auth.type'
import { Loader2 } from 'lucide-react'

export default function AdminAuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
   const router = useRouter()
   const pathname = usePathname()
   const [isChecking, setIsChecking] = useState(true)
   const [isAuthorized, setIsAuthorized] = useState(false)

   useEffect(() => {
      const checkAuth = () => {
         // Allow login page without auth check
         if (pathname === '/admin/login') {
            setIsChecking(false)
            setIsAuthorized(true)
            return
         }

         // Check for token
         const token = localStorage.getItem('accessToken')

         if (!token) {
            router.push('/admin/login')
            return
         }

         try {
            const decoded: TokenPayload = jwtDecode(token)

            // Check token expiration
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
               localStorage.removeItem('accessToken')
               localStorage.removeItem('refreshToken')
               router.push('/admin/login')
               return
            }

            // Check role
            if (decoded.role !== 'ADMIN') {
               router.push('/admin/login')
               return
            }

            // All checks passed
            setIsAuthorized(true)
            setIsChecking(false)
         } catch (error) {
            console.error('Token validation failed:', error)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            router.push('/admin/login')
         }
      }

      checkAuth()
   }, [pathname, router])

   // Show loading spinner while checking auth (except for login page)
   if (isChecking && pathname !== '/admin/login') {
      return (
         <div className='flex h-screen items-center justify-center bg-gray-50'>
            <div className='text-center'>
               <Loader2 className='text-primary mx-auto h-8 w-8 animate-spin' />
               <p className='mt-4 text-sm text-gray-600'>Đang xác thực...</p>
            </div>
         </div>
      )
   }

   // Render children only if authorized
   return isAuthorized ? <>{children}</> : null
}
