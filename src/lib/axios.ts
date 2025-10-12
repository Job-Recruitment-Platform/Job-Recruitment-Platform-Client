import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// Base API response structure
export interface ApiResponse<T = unknown> {
   code: number
   message: string
   data: T
}

// Custom error class
export class ApiError extends Error {
   constructor(
      public code: number,
      public message: string,
      public data?: unknown
   ) {
      super(message)
      this.name = 'ApiError'
   }
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
   timeout: 30000, // 30 seconds
   headers: {
      'Content-Type': 'application/json'
   }
})

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

// Request interceptor
axiosInstance.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage (nếu có)
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

// Response interceptor
axiosInstance.interceptors.response.use(
   (response) => {
      return response
   },
   async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Handle 401 - Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
         // Skip refresh for login and refresh endpoints
         if (
            originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/refresh')
         ) {
            // Clear tokens and redirect to login
            if (typeof window !== 'undefined') {
               localStorage.removeItem('accessToken')
               localStorage.removeItem('refreshToken')
               window.location.href = '/auth/login'
            }
            throw new ApiError(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
         }

         if (isRefreshing) {
            // Wait for refresh to complete
            return new Promise((resolve, reject) => {
               failedQueue.push({ resolve, reject })
            })
               .then(() => {
                  return axiosInstance(originalRequest)
               })
               .catch((err) => {
                  return Promise.reject(err)
               })
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
            >(`${axiosInstance.defaults.baseURL}/auth/refresh`, {
               refreshToken
            })

            const { accessToken, refreshToken: newRefreshToken } = response.data.data

            // Save new tokens
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            // Update authorization header
            if (originalRequest.headers) {
               originalRequest.headers.Authorization = `Bearer ${accessToken}`
            }

            processQueue(null)
            return axiosInstance(originalRequest)
         } catch {
            processQueue(new Error('Token refresh failed'))

            // Clear tokens and redirect to login
            if (typeof window !== 'undefined') {
               localStorage.removeItem('accessToken')
               localStorage.removeItem('refreshToken')
               window.location.href = '/auth/login'
            }

            throw new ApiError(401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
         } finally {
            isRefreshing = false
         }
      }

      // Handle other errors
      if (error.response) {
         const { code, message, data } = error.response.data || {}

         // Throw custom ApiError
         throw new ApiError(
            code || error.response.status,
            message || error.response.statusText || 'Đã có lỗi xảy ra',
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

export default axiosInstance
