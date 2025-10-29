import { ApiError, type ApiResponse } from '@/lib/axios'
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// Flag to prevent multiple refresh token calls
let isRefreshing = false
let failedQueue: Array<{
   resolve: (value?: unknown) => void
   reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null = null) => {
   failedQueue.forEach((prom) => {
      if (error) {
         prom.reject(error)
      } else {
         prom.resolve()
      }
   })

   failedQueue = []
}

const clearAuthAndRedirect = () => {
   if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/auth/login'
   }
}

/**
 * Setup authentication interceptors for axios instance
 * Handles token injection and auto-refresh on 401
 */
export const setupAuthInterceptors = (client: AxiosInstance, baseURL: string) => {
   // Request interceptor - inject access token
   client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
         if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken')
            if (token && config.headers) {
               config.headers.Authorization = `Bearer ${token}`
            }
         }
         return config
      },
      (error) => {
         return Promise.reject(error)
      }
   )

   // Response interceptor - handle 401 and auto-refresh token
   client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
         const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

         // Handle 401 - Unauthorized
         if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip refresh for auth endpoints
            if (
               originalRequest.url?.includes('/auth/login') ||
               originalRequest.url?.includes('/auth/refresh')
            ) {
               clearAuthAndRedirect()
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
               const refreshToken = localStorage.getItem('refreshToken')
               if (!refreshToken) {
                  throw new Error('No refresh token')
               }

               // Call refresh token API
               const response = await axios.post<
                  ApiResponse<{ accessToken: string; refreshToken: string }>
               >(`${baseURL}/auth/refresh`, { refreshToken })

               const { accessToken, refreshToken: newRefreshToken } = response.data.data

               // Save new tokens
               localStorage.setItem('accessToken', accessToken)
               localStorage.setItem('refreshToken', newRefreshToken)

               // Update authorization header
               if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${accessToken}`
               }

               processQueue(null)
               return client(originalRequest)
            } catch {
               processQueue(new Error('Token refresh failed'))
               clearAuthAndRedirect()
               throw new ApiError(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
            } finally {
               isRefreshing = false
            }
         }

         // Handle other errors
         if (error.response) {
            const { code, message, data } = error.response.data || {}
            throw new ApiError(
               typeof code === 'number' ? code : error.response.status,
               typeof message === 'string'
                  ? message
                  : error.response.statusText || 'Đã có lỗi xảy ra',
               data
            )
         }

         // Network error
         if (error.request) {
            throw new ApiError(0, 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.')
         }

         // Other errors
         throw new ApiError(0, error.message || 'Đã có lỗi không xác định')
      }
   )
}
