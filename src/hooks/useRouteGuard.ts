'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useRouteGuard() {
   const { role } = useAuthStore()
   const pathname = usePathname()
   const router = useRouter()

   useEffect(() => {
      if (!role) return

      const isRecruiterRoute = pathname.startsWith('/recruiter')
      const isAdminRoute = pathname.startsWith('/admin')
      const isAuthRoute = pathname.startsWith('/auth')

      // RECRUITER: Only allow recruiter routes
      if (role === 'RECRUITER') {
         if (!isRecruiterRoute && !isAuthRoute) {
            router.replace('/recruiter/dashboard')
            return
         }
      }

      // CANDIDATE: Block recruiter and admin routes
      if (role === 'CANDIDATE') {
         if (isRecruiterRoute || isAdminRoute) {
            router.replace('/')
            return
         }
      }

      // Block non-recruiter from accessing recruiter routes
      if (isRecruiterRoute && role !== 'RECRUITER') {
         router.replace('/')
         return
      }

      // Block non-admin from accessing admin routes
      if (isAdminRoute && role !== 'ADMIN') {
         router.replace('/')
         return
      }
   }, [role, pathname, router])
}
