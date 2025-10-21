'use client'

import { authService } from '@/services/auth.service'
import type { LoginRequest, RegisterRequest } from '@/types/auth.type'
import { createContext, useEffect, useState, type ReactNode } from 'react'

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
   const [isLogin, setIsLogin] = useState(false)
   const [isLoading, setIsLoading] = useState(true)

   // Check authentication status on mount
   const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsLogin(authenticated)
   }

   useEffect(() => {
      checkAuth()
      setIsLoading(false)
   }, [])

   const login = async (data: LoginRequest) => {
      await authService.login(data)
      setIsLogin(true)
   }

   const logout = async () => {
      await authService.logout()
      setIsLogin(false)
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
