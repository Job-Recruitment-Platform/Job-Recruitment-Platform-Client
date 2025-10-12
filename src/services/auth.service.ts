import axiosInstance, { type ApiResponse } from '@/lib/axios'
import type {
   LoginResponseData,
   LoginType,
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

      // Save token to localStorage
      if (response.data.data.accessToken) {
         localStorage.setItem('accessToken', response.data.data.accessToken)
         if (response.data.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.data.refreshToken)
         }
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
         // Clear tokens
         localStorage.removeItem('accessToken')
         localStorage.removeItem('refreshToken')
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
   async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
      const response = await axiosInstance.post<ApiResponse<{ accessToken: string }>>(
         `${this.BASE_PATH}/refresh`,
         { refreshToken }
      )

      // Update access token
      if (response.data.data.accessToken) {
         localStorage.setItem('accessToken', response.data.data.accessToken)
      }

      return response.data
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
}

// Export singleton instance
export const authService = new AuthService()
