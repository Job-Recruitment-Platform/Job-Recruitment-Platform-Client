import { setupAuthInterceptors } from '@/interceptor/auth.interceptor'
import { setupResponseInterceptors } from '@/interceptor/response.interceptor'
import axios, { type AxiosInstance } from 'axios'

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

// Create axios instance for default API (port 8080) - used by all services except search
const defaultApiClient: AxiosInstance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
   timeout: 30000, // 30 seconds
   headers: {
      'Content-Type': 'application/json'
   }
})

// Legacy: default apiClient (for backward compatibility)
const apiClient: AxiosInstance = defaultApiClient

// Setup authentication interceptors for both clients
setupResponseInterceptors(defaultApiClient)
setupAuthInterceptors(defaultApiClient)

export default apiClient
