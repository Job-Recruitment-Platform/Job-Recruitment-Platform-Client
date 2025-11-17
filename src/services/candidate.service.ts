import { ApiResponse } from '@/lib/axios'
import { useSavedJobsStore } from '@/store/useSavedJobStore'
import { PaginationResponse } from '@/types/api.type.'
import { CandidateProfileResponse, UpdateCandidateProfileRequest } from '@/types/candidate.type'
import { SavedJobType } from '@/types/job.type'
import { BaseService } from './base.service'
import { ResourceResponse } from '@/types/resource.type'

export interface ApplyJobRequest {
   jobId: string | number
   file: File
   coverLetter?: string
}

export interface ApplyJobResponse {
   id: number
   jobId: number
   candidateId: number
   status: string
   appliedAt: string
   message?: string
}

class CandidateService extends BaseService {
   constructor() {
      super('/candidates')
   }

   /**
    * Apply for a job
    * @param data - Application data including file and cover letter
    */
   async applyForJob(data: ApplyJobRequest): Promise<ApplyJobResponse> {
      const formData = new FormData()

      // Append file with field name 'file'
      formData.append('file', data.file, data.file.name)

      // Append cover letter if provided
      if (data.coverLetter) {
         formData.append('coverLetter', data.coverLetter)
      }

      const response = await this.post<ApplyJobResponse>(`/applications/${data.jobId}`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      })

      return response.data
   }

   async getSavedJobs(): Promise<PaginationResponse<SavedJobType[]>> {
      const response = await this.get<PaginationResponse<SavedJobType[]>>(`/saved-jobs`)

      if (response.data) {
         useSavedJobsStore.getState().setJobs(response.data.content)
      }

      return response.data
   }

   async saveJob(jobId: number): Promise<void> {
      const response = await this.post<SavedJobType>(`/save/${jobId}`)

      if (response.data.id) {
         useSavedJobsStore.getState().addJob(response.data)
      }
   }

   async removeSavedJob(jobId: number): Promise<void> {
      const response = await this.delete(`/save/${jobId}`)

      if (response.code === 1000) {
         useSavedJobsStore.getState().removeJob(jobId)
      }
   }

   async updateProfile(
      data: UpdateCandidateProfileRequest
   ): Promise<ApiResponse<CandidateProfileResponse>> {
      return await this.put<CandidateProfileResponse>(`/profile`, data)
   }

   async getProfile(): Promise<ApiResponse<CandidateProfileResponse>> {
      return await this.get<CandidateProfileResponse>(`/profile`)
   }

   async getCandidateResumes(
      page: number = 1,
      size: number = 10
   ): Promise<ApiResponse<PaginationResponse<ResourceResponse>>> {
      return await this.get<PaginationResponse<ResourceResponse>>(
         `/resumes?page=${page}&size=${size}`
      )
   }
}
const candidateService = new CandidateService()
export default candidateService
