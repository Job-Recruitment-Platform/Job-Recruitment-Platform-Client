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
   (error: AxiosError<ApiResponse>) => {
      // Handle specific error cases
      if (error.response) {
         const { code, message, data } = error.response.data || {}

         // 401 - Unauthorized: Clear token and redirect to login
         if (error.response.status === 401) {
            if (typeof window !== 'undefined') {
               localStorage.removeItem('accessToken')
               localStorage.removeItem('refreshToken')
               window.location.href = '/auth/login'
            }
         }

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
