import type { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { useAuthStore } from '@/store/useAuthStore'
import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '@/types/auth.type'
import { jwtDecode } from 'jwt-decode'

/**
 * Authentication Service
 * Handles all auth-related API calls and token management
 */
class AuthService extends BaseService {
   constructor() {
      super('/auth')
   }

   /**
    * Register a new candidate
    */
   async registerCandidate(payload: RegisterRequest): Promise<ApiResponse<UserResponse>> {
      return this.post<UserResponse>('/register/candidate', payload)
   }

   /**
    * Login user and save tokens
    */
   async login(payload: LoginRequest): Promise<ApiResponse<TokenResponse>> {
      const response = await this.post<TokenResponse>('/login', payload)
      this.saveTokens(response.data)
      this.saveAuthState(response.data.accessToken)
      return response
   }

   /**
    * Logout user
    */
   // async logout(payload: LogoutRequest)
   async logout(): Promise<void> {
      try {
         // await this.post('/logout', payload)  // error ???
      } finally {
         this.clearTokens()
         this.clearAuthState()
      }
   }

   /**
    * Refresh access token
    */
   async refreshToken(): Promise<ApiResponse<TokenResponse>> {
      const refreshToken = this.getRefreshToken()

      if (!refreshToken) {
         throw new Error('No refresh token available')
      }

      const response = await this.post<TokenResponse>('/refresh', {
         refreshToken
      })

      this.saveTokens(response.data)
      return response
   }

   /**
    * Token management - Private methods
    */

   private saveTokens(tokens: TokenResponse): void {
      if (typeof window === 'undefined') return

      if (tokens.accessToken) {
         localStorage.setItem('accessToken', tokens.accessToken)
      }
      if (tokens.refreshToken) {
         localStorage.setItem('refreshToken', tokens.refreshToken)
      }
   }

   /**
    * Save isLogin and role to localStorage and Zustand store
    */
   private saveAuthState(accessToken?: string): void {
      if (typeof window === 'undefined') return
      if (accessToken) {
         localStorage.setItem('isLogin', 'true')
         useAuthStore.getState().setIsLogin(true)

         try {
            const decoded: any = jwtDecode(accessToken)
            if (decoded && decoded.role) {
               localStorage.setItem('role', decoded.role)
               useAuthStore.getState().setRole(decoded.role)
            }
         } catch (e) {
            localStorage.removeItem('role')
            useAuthStore.getState().setRole(null)
         }
      }
   }

   /**
    * Clear isLogin and role from localStorage and Zustand store
    */
   private clearAuthState(): void {
      if (typeof window === 'undefined') return
      localStorage.removeItem('isLogin')
      localStorage.removeItem('role')
      useAuthStore.getState().setIsLogin(false)
      useAuthStore.getState().setRole(null)
   }

   /**
    * Clear all stored tokens
    */
   clearTokens(): void {
      if (typeof window === 'undefined') return
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
   }

   /**
    * Check if user is authenticated
    */
   isAuthenticated(): boolean {
      if (typeof window === 'undefined') return false
      return !!this.getAccessToken()
   }

   /**
    * Get stored access token
    */
   getAccessToken(): string | null {
      if (typeof window === 'undefined') return null
      return localStorage.getItem('accessToken')
   }

   /**
    * Get stored refresh token
    */
   getRefreshToken(): string | null {
      if (typeof window === 'undefined') return null
      return localStorage.getItem('refreshToken')
   }
}

// Export singleton instance
export const authService = new AuthService()
