import { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { RecruiterResponse, UpdateRecruiterProfileRequest } from '@/types/recruiter.type'

/**
 * Recruiter Service
 * Handles all recruiter-related API calls
 */
class RecruiterService extends BaseService {
   constructor() {
      super('/recruiters')
   }

   async getProfile(): Promise<ApiResponse<RecruiterResponse>> {
      return await this.get<RecruiterResponse>('/profile', {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
         }
      })
   }

   async updateProfile(
      profileData: UpdateRecruiterProfileRequest
   ): Promise<ApiResponse<RecruiterResponse>> {
      return await this.put<RecruiterResponse>('/profile', profileData, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
         }
      })
   }
}

export const recruiterService = new RecruiterService()

