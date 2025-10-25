'use client'

import { AuthContext } from '@/contexts/AuthContext'
import { useContext } from 'react'

/**
 * Custom hook to use authentication context
 * Must be used within AuthProvider
 *
 * @throws Error if used outside of AuthProvider
 * @returns AuthContextType with auth state and methods
 */
export const useAuth = () => {
   const context = useContext(AuthContext)

   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider')
   }

   return context
}
