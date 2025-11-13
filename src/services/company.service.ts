import { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { PaginationResponse } from '@/types/api.type.'
import {
   CompanyRequest,
   CompanyResponse,
   VerifyCompanyRequest,
   VerifyCompanyResponse
} from '@/types/company.type'
import { ResourceResponse } from '@/types/resource.type'

/**
 * Company Service
 * Handles all company-related API calls
 */
class CompanyService extends BaseService {
   constructor() {
      super('/companies')
   }

   async getCompanyProfile(companyId: number): Promise<ApiResponse<CompanyResponse>> {
      const tmp = await this.get<CompanyResponse>(`/public/${companyId}`)
      console.log('Company profile response:', tmp)
      return tmp
   }

   async updateCompanyProfile(profileData: CompanyRequest): Promise<ApiResponse<CompanyResponse>> {
      return await this.put<CompanyResponse>('', profileData, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
         }
      })
   }

   async getCompanyAttestions(companyId: number): Promise<ResourceResponse[]> {
      const response = await this.get<ResourceResponse[]>(`/${companyId}/attestations`)
      return response.data
   }

   async getVerifyList(): Promise<PaginationResponse<CompanyResponse[]>> {
      const response = await this.get<PaginationResponse<CompanyResponse[]>>('/verify')
      return response.data
   }

   async verifyAttestion(request: VerifyCompanyRequest): Promise<VerifyCompanyResponse> {
      const response = await this.patch<VerifyCompanyResponse>('/verify', request)
      return response.data
   }
}

export const companyService = new CompanyService()
