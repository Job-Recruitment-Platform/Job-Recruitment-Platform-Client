import { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { CompanyRequest, CompanyResponse } from '@/types/company.type'

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
}

export const companyService = new CompanyService()