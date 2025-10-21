import apiClient, { type ApiResponse } from '@/lib/axios'
import type { AxiosRequestConfig } from 'axios'

/**
 * Generic base service class for all API services
 * Provides common CRUD operations and error handling
 */
export abstract class BaseService {
   protected readonly basePath: string

   constructor(basePath: string) {
      this.basePath = basePath
   }

   /**
    * Generic GET request
    */
   protected async get<T>(endpoint: string, config?: AxiosRequestConfig) {
      const response = await apiClient.get<ApiResponse<T>>(`${this.basePath}${endpoint}`, config)
      return response.data
   }

   /**
    * Generic POST request
    */
   protected async post<T, D = unknown>(endpoint: string, data?: D, config?: AxiosRequestConfig) {
      const response = await apiClient.post<ApiResponse<T>>(
         `${this.basePath}${endpoint}`,
         data,
         config
      )
      return response.data
   }

   /**
    * Generic PUT request
    */
   protected async put<T, D = unknown>(endpoint: string, data?: D, config?: AxiosRequestConfig) {
      const response = await apiClient.put<ApiResponse<T>>(
         `${this.basePath}${endpoint}`,
         data,
         config
      )
      return response.data
   }

   /**
    * Generic PATCH request
    */
   protected async patch<T, D = unknown>(endpoint: string, data?: D, config?: AxiosRequestConfig) {
      const response = await apiClient.patch<ApiResponse<T>>(
         `${this.basePath}${endpoint}`,
         data,
         config
      )
      return response.data
   }

   /**
    * Generic DELETE request
    */
   protected async delete<T>(endpoint: string, config?: AxiosRequestConfig) {
      const response = await apiClient.delete<ApiResponse<T>>(`${this.basePath}${endpoint}`, config)
      return response.data
   }
}
