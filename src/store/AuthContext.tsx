'use client'

import { authService } from '@/services/auth.service'
import type { LoginRequest, RegisterRequest } from '@/types/auth.type'
import { createContext, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface AuthContextType {
   isLogin: boolean
   isLoading: boolean
   login: (data: LoginRequest) => Promise<void>
   logout: () => Promise<void>
   register: (data: RegisterRequest) => Promise<void>
   checkAuth: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
   children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
   const queryClient = useQueryClient()
   const [isLogin, setIsLogin] = useState(false)
   const [isLoading, setIsLoading] = useState(true)

   // Check authentication status on mount
   const checkAuth = async () => {
      setIsLoading(true)
      try {
         const authenticated = authService.isAuthenticated()
         setIsLogin(authenticated)
      }
      catch (error) {
         setIsLogin(false)
      } finally {
         setIsLoading(false)
      }
   }

   useEffect(() => {
      checkAuth()
      setIsLoading(false)
   }, [])

   const login = async (data: LoginRequest) => {
      // Clear all cached queries before login to prevent stale data
      queryClient.clear()
      await authService.login(data)
      setIsLogin(true)
   }

   const logout = async () => {
      try {
         const refreshToken = authService.getRefreshToken() || ''
         await authService.logout({ refreshToken })
      } catch (error) {
         // Even if logout API fails, clear local state
         console.error('Logout error:', error)
      } finally {
         // Clear all cached queries on logout
         queryClient.clear()
         setIsLogin(false)
      }
   }

   const register = async (data: RegisterRequest) => {
      await authService.registerCandidate(data)
      // Don't auto login after register
   }

   const value: AuthContextType = {
      isLogin,
      isLoading,
      login,
      logout,
      register,
      checkAuth
   }

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
