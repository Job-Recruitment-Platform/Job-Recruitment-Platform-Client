import type { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import type { LoginRequest, LogoutRequest, RegisterRequest, TokenResponse, UserResponse } from '@/types/auth.type'

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
      return response
   }

   /**
    * Logout user
    */
   async logout(payload: LogoutRequest): Promise<void> {
      try {
         await this.post('/logout', payload)
      } finally {
         this.clearTokens()
      }
   }

   /**
    * Get current authenticated user
    */
   async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
      return this.get<UserResponse>('/me')
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
