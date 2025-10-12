'use client'

import { authService } from '@/services/auth.service'
import type { LoginType, RegisterType } from '@/types/auth.type'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface AuthContextType {
   isLogin: boolean
   isLoading: boolean
   login: (data: LoginType) => Promise<void>
   logout: () => Promise<void>
   register: (data: RegisterType) => Promise<void>
   checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

   const login = async (data: LoginType) => {
      await authService.login(data)
      setIsLogin(true)
   }

   const logout = async () => {
      await authService.logout()
      setIsLogin(false)
   }

   const register = async (data: RegisterType) => {
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

export function useAuth() {
   const context = useContext(AuthContext)
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider')
   }
   return context
}
