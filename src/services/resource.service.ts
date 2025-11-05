import { ApiResponse } from '@/lib/axios'
import { BaseService } from './base.service'
import { ResourceResponse } from '@/types/resource.type'


class ResourceService extends BaseService {
   constructor() {
      super('/resources')
   }

   async uploadAvatar(file: File): Promise<ApiResponse<ResourceResponse>> {
      const formData = new FormData()
      formData.append('file', file, file.name)
      return await this.post<ResourceResponse>(`/upload/avatar`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      })
   }
    async uploadCompanyLogo(file: File): Promise<ApiResponse<ResourceResponse>> {
        const formData = new FormData()
        formData.append('file', file, file.name)
        return await this.post<ResourceResponse>(`/upload/company-logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    async downloadResource(resourceUrl: string): Promise<ArrayBuffer> {
         // Server returns ApiResponse<{ content: ArrayBuffer }> structure
         // Response: { code: 1000, data: { content: ArrayBuffer | base64 string } }
         // With responseType: 'arraybuffer', we get raw bytes, need to parse JSON
         const response = await this.httpClient.get(`${this.basePath}/download?url=${resourceUrl}`, {
            responseType: 'arraybuffer'
         })
         
         // Parse the ArrayBuffer as text to get JSON string
         const textDecoder = new TextDecoder('utf-8')
         const jsonString = textDecoder.decode(response.data as ArrayBuffer)
         const apiResponse = JSON.parse(jsonString) as ApiResponse<{ content: ArrayBuffer | string }>
         
         if (!apiResponse?.data?.content) {
            throw new Error('No content found in response')
         }
         
         const content = apiResponse.data.content
         
         // If content is already ArrayBuffer (shouldn't happen in JSON, but check anyway)
         if (content instanceof ArrayBuffer) {
            return content
         }
         
         // Content should be base64 encoded string, decode it to ArrayBuffer
         if (typeof content === 'string') {
            const binaryString = atob(content)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
               bytes[i] = binaryString.charCodeAt(i)
            }
            return bytes.buffer
         }
         
         throw new Error('Unsupported content type in response')
    }
}

export const resourceService = new ResourceService()
