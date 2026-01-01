'use client'

import { useRouteGuard } from '@/hooks/useRouteGuard'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

type RouteGuardProps = {
   children: React.ReactNode
}

export default function RouteGuard({ children }: RouteGuardProps) {
   const { setIsLogin, setRole } = useAuthStore()

   // Initialize auth state from localStorage on mount
   useEffect(() => {
      if (typeof window !== 'undefined') {
         const isLogin = localStorage.getItem('isLogin') === 'true'
         const role = localStorage.getItem('role')

         setIsLogin(isLogin)
         setRole(role)
      }
   }, [setIsLogin, setRole])

   // Apply route guard
   useRouteGuard()

   return <>{children}</>
}
