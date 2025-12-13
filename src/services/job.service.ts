import { BaseService } from '@/services/base.service'
import { PaginationResponse } from '@/types/api.type.'
import type {
   ApplicationStatus,
   CreateJobRequest,
   JobApplicantResponse,
   JobDetail,
   JobResponse,
   JobStatus,
   ModerateAction,
   UpdateJobRequest
} from '@/types/job.type'

/**
 * Job Service
 * Handles all job-related API calls (detail, favorites, applications, etc.)
 */
class JobService extends BaseService {
   constructor() {
      super('')
   }

   async getAllJobs(
      page?: number,
      size?: number,
      sortBy?: string,
      sortDir?: string
   ): Promise<PaginationResponse<JobResponse[]>> {
      const response = await this.get<PaginationResponse<JobResponse[]>>(
         `/jobs/public?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
      )
      return response.data
   }

   /**
    * Get job detail by job ID
    * GET /job/public/detail/{job_id}
    */
   async getJobDetail(jobId: number): Promise<JobDetail> {
      const response = await this.get<JobDetail>(`/jobs/public/detail/${jobId}`)
      return response.data
   }

   /**
    * Get multiple jobs by IDs
    */
   async getJobsByIds(jobIds: number[]): Promise<JobDetail[]> {
      const promises = jobIds.map((id) => this.getJobDetail(id))
      return Promise.all(promises)
   }

   async getCompanyJobs(status: JobStatus): Promise<PaginationResponse<JobResponse[]>> {
      const response = await this.get<PaginationResponse<JobResponse[]>>(
         `/recruiters/company/jobs?jobStatus=${status}`
      )
      console.log('Company jobs response:', response)
      return response.data
   }

   async createJob(request: CreateJobRequest): Promise<JobResponse> {
      const response = await this.post<JobResponse>('/job', request)
      return response.data
   }

   async updateJob(jobId: number, request: UpdateJobRequest): Promise<JobResponse> {
      const response = await this.put<JobResponse>(`/job/${jobId}`, request)
      return response.data
   }

   async cancelJob(jobId: number): Promise<JobResponse> {
      const response = await this.patch<JobResponse>(`/job/cancel/${jobId}`)
      return response.data
   }

   async getJobApplicants(jobId: number): Promise<PaginationResponse<JobApplicantResponse[]>> {
      const response = await this.get<PaginationResponse<any>>(
         `/recruiters/company/${jobId}/applicants`
      )
      return response.data
   }

   async processJobApplication(
      applicationId: number,
      action: ApplicationStatus
   ): Promise<JobApplicantResponse> {
      const response = await this.post<JobApplicantResponse>(
         `/recruiters/company/applicants/${applicationId}?action=${action}`
      )
      return response.data
   }

   async moderateJobPosting(jobId: number, action: ModerateAction): Promise<JobResponse> {
      const response = await this.patch<JobResponse>(`/${jobId}/moderate?action=${action}`)
      return response.data
   }

   // Recommend
   async getRecommendedJobs(): Promise<JobResponse[]> {
      const response = await this.get<JobResponse[]>('/jobs/public/recommend')
      return response.data
   }

   /**
    * Check if job is available (not expired)
    */
   isJobAvailable(job: JobDetail): boolean {
      return job.status !== 'EXPIRED'
   }

   /**
    * Format job detail for display
    */
   formatJobDetail(job: JobDetail) {
      return {
         ...job,
         datePosted: new Date(job.datePosted),
         dateExpires: new Date(job.dateExpires)
      }
   }
}

// Export singleton instance
export const jobService = new JobService()
