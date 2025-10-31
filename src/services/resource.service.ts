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
}

export const resourceService = new ResourceService()
