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

      // Log request trong development
      if (process.env.NODE_ENV === 'development') {
         console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data
         })
      }

      return config
   },
   (error) => {
      console.error('❌ Request Error:', error)
      return Promise.reject(error)
   }
)

// Response interceptor
axiosInstance.interceptors.response.use(
   (response) => {
      // Log response trong development
      if (process.env.NODE_ENV === 'development') {
         console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
         })
      }

      // Return data từ ApiResponse structure
      return response
   },
   (error: AxiosError<ApiResponse>) => {
      // Log error trong development
      if (process.env.NODE_ENV === 'development') {
         console.error('❌ API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
         })
      }

      // Handle specific error cases
      if (error.response) {
         const { code, message, data } = error.response.data

         // 401 - Unauthorized: Clear token and redirect to login
         if (error.response.status === 401) {
            if (typeof window !== 'undefined') {
               localStorage.removeItem('accessToken')
               window.location.href = '/auth/login'
            }
         }

         // 403 - Forbidden
         if (error.response.status === 403) {
            console.error('Access denied')
         }

         // 500 - Server Error
         if (error.response.status >= 500) {
            console.error('Server error occurred')
         }

         // Throw custom ApiError
         throw new ApiError(code || error.response.status, message || 'An error occurred', data)
      }

      // Network error
      if (error.request) {
         throw new ApiError(0, 'Network error. Please check your connection.')
      }

      // Other errors
      throw new ApiError(0, error.message || 'An unexpected error occurred')
   }
)

export default axiosInstance
