import apiClient, { type ApiResponse } from '@/lib/axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

/**
 * Generic base service class for all API services
 * Provides common CRUD operations and error handling
 */
export abstract class BaseService {
   protected readonly basePath: string
   protected readonly httpClient: AxiosInstance

   constructor(basePath: string, httpClient: AxiosInstance = apiClient) {
      this.basePath = basePath
      this.httpClient = httpClient
   }

   /**
    * Generic GET request
    */
   protected async get<T>(endpoint: string, config?: AxiosRequestConfig) {
      const response = await this.httpClient.get<ApiResponse<T>>(
         `${this.basePath}${endpoint}`,
         config
      )
      return response.data
   }

   /**
    * Generic POST request
    */
   protected async post<T, D = unknown>(endpoint: string, data?: D, config?: AxiosRequestConfig) {
      const response = await this.httpClient.post<ApiResponse<T>>(
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
      const response = await this.httpClient.put<ApiResponse<T>>(
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
      const response = await this.httpClient.patch<ApiResponse<T>>(
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
      const response = await this.httpClient.delete<ApiResponse<T>>(
         `${this.basePath}${endpoint}`,
         config
      )
      return response.data
   }
}
