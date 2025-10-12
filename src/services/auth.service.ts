import axiosInstance, { type ApiResponse } from '@/lib/axios'
import type {
   LoginResponseData,
   LoginType,
   RefreshTokenResponseData,
   RegisterResponseData,
   RegisterType
} from '@/types/auth.type'

class AuthService {
   private readonly BASE_PATH = '/auth'

   /**
    * Register new candidate
    * POST /auth/register/candidate
    */
   async registerCandidate(data: RegisterType): Promise<ApiResponse<RegisterResponseData>> {
      const response = await axiosInstance.post<ApiResponse<RegisterResponseData>>(
         `${this.BASE_PATH}/register/candidate`,
         data
      )
      return response.data
   }

   /**
    * Login user
    * POST /auth/login
    */
   async login(data: LoginType): Promise<ApiResponse<LoginResponseData>> {
      const response = await axiosInstance.post<ApiResponse<LoginResponseData>>(
         `${this.BASE_PATH}/login`,
         data
      )

      // Save tokens to localStorage
      const { accessToken, refreshToken } = response.data.data
      if (accessToken) {
         localStorage.setItem('accessToken', accessToken)
      }
      if (refreshToken) {
         localStorage.setItem('refreshToken', refreshToken)
      }

      return response.data
   }

   /**
    * Logout user
    * POST /auth/logout
    */
   async logout(): Promise<void> {
      try {
         await axiosInstance.post(`${this.BASE_PATH}/logout`)
      } finally {
         // Clear tokens regardless of API response
         this.clearTokens()
      }
   }

   /**
    * Get current user
    * GET /auth/me
    */
   async getCurrentUser(): Promise<ApiResponse<RegisterResponseData>> {
      const response = await axiosInstance.get<ApiResponse<RegisterResponseData>>(
         `${this.BASE_PATH}/me`
      )
      return response.data
   }

   /**
    * Refresh token
    * POST /auth/refresh
    */
   async refreshToken(): Promise<ApiResponse<RefreshTokenResponseData>> {
      const currentRefreshToken = this.getRefreshToken()

      if (!currentRefreshToken) {
         throw new Error('No refresh token available')
      }

      const response = await axiosInstance.post<ApiResponse<RefreshTokenResponseData>>(
         `${this.BASE_PATH}/refresh`,
         { refreshToken: currentRefreshToken }
      )

      // Update both tokens
      const { accessToken, refreshToken } = response.data.data
      if (accessToken) {
         localStorage.setItem('accessToken', accessToken)
      }
      if (refreshToken) {
         localStorage.setItem('refreshToken', refreshToken)
      }

      return response.data
   }

   /**
    * Clear all tokens
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
      return !!localStorage.getItem('accessToken')
   }

   /**
    * Get access token
    */
   getAccessToken(): string | null {
      if (typeof window === 'undefined') return null
      return localStorage.getItem('accessToken')
   }

   /**
    * Get refresh token
    */
   getRefreshToken(): string | null {
      if (typeof window === 'undefined') return null
      return localStorage.getItem('refreshToken')
   }
}

// Export singleton instance
export const authService = new AuthService()
