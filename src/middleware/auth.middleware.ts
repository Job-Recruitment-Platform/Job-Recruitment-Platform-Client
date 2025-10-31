import { ApiError, type ApiResponse } from '@/lib/axios'
import { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// ==================== Token Management ====================

function getAccessToken(): string | null {
   if (typeof window === 'undefined') return null
   return localStorage.getItem('accessToken')
}

function getRefreshToken(): string | null {
   if (typeof window === 'undefined') return null
   return localStorage.getItem('refreshToken')
}

function clearTokens(): void {
   if (typeof window === 'undefined') return
   localStorage.removeItem('accessToken')
   localStorage.removeItem('refreshToken')
}

// ==================== Auth Handlers ====================

async function handleUnauthorized(): Promise<void> {
   clearTokens()
   if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
   }
}

async function getAuthService() {
   const { authService } = await import('@/services/auth.service')
   return authService
}

// ==================== Token Refresh Queue ====================

let isRefreshing = false
let failedQueue: Array<{
   resolve: (value?: unknown) => void
   reject: (reason?: unknown) => void
}> = []

function processQueue(error: Error | null = null): void {
   failedQueue.forEach((prom) => {
      if (error) {
         prom.reject(error)
      } else {
         prom.resolve()
      }
   })
   failedQueue = []
}

// ==================== Error Handling ====================

function createApiError(error: AxiosError<ApiResponse>): ApiError {
   if (error.response) {
      const { code, message, data } = error.response.data || {}
      return new ApiError(
         typeof code === 'number' ? code : error.response.status,
         typeof message === 'string' ? message : error.response.statusText || 'Đã có lỗi xảy ra',
         data
      )
   }

   if (error.request) {
      return new ApiError(0, 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.')
   }

   return new ApiError(0, error.message || 'Đã có lỗi không xác định')
}

// ==================== Interceptor Setup ====================

/**
 * Setup authentication interceptors for axios instance
 * Handles token injection and auto-refresh on 401
 */
export function setupAuthInterceptors(client: AxiosInstance): void {
   // Request interceptor - inject access token
   client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
         const token = getAccessToken()
         if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
         }
         return config
      },
      (error) => Promise.reject(error)
   )

   // Response interceptor - handle errors and auto-refresh
   client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
         const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
         const status = error.response?.status

         // Handle 401 - Unauthorized
         if (status === 401 && !originalRequest._retry) {
            // Skip refresh for auth endpoints
            const isAuthEndpoint =
               originalRequest.url?.includes('/auth/login') ||
               originalRequest.url?.includes('/auth/refresh') ||
               originalRequest.url?.includes('/recruiter/register')

            if (isAuthEndpoint) {
               await handleUnauthorized()
               throw new ApiError(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
            }

            // Queue requests while refreshing
            if (isRefreshing) {
               return new Promise((resolve, reject) => {
                  failedQueue.push({ resolve, reject })
               })
                  .then(() => client(originalRequest))
                  .catch((err) => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
               const refreshToken = getRefreshToken()
               if (!refreshToken) {
                  throw new Error('No refresh token available')
               }

               // Use authService to refresh token
               const authService = await getAuthService()
               await authService.refreshToken()

               // Update authorization header with new token
               const newAccessToken = getAccessToken()
               if (originalRequest.headers && newAccessToken) {
                  originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
               }

               processQueue(null)
               return client(originalRequest)
            } catch {
               processQueue(new Error('Token refresh failed'))
               await handleUnauthorized()
               throw new ApiError(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
            } finally {
               isRefreshing = false
            }
         }

         // Throw structured ApiError for all cases
         throw createApiError(error)
      }
   )
}
