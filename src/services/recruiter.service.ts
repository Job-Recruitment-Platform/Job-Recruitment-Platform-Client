import { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { PaginationResponse } from '@/types/api.type.'
import { CreateInterviewRequest, InterviewResponse, UpdateInterviewRequest } from '@/types/interview.type'
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

   async interviewSchedule(payload: CreateInterviewRequest): Promise<ApiResponse<InterviewResponse>> {
      return await this.post<InterviewResponse>('/company/applicants/interview', payload, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
         }
      })
   }

   async updateInterview(payload: UpdateInterviewRequest): Promise<ApiResponse<InterviewResponse>> {
      return await this.patch<InterviewResponse>('/company/applicants/interview', payload, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
         }
      })
   }

   async getCompanyInterviews(): Promise<ApiResponse<PaginationResponse<InterviewResponse[]>>> {
      return await this.get<PaginationResponse<InterviewResponse[]>>('/company/applicants/interview', {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
         }
      })
   }
}
export const recruiterService = new RecruiterService();

