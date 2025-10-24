import { BaseService } from '@/services/base.service'
import type { JobDetail } from '@/types/job.type'

/**
 * Job Service
 * Handles all job-related API calls (detail, favorites, applications, etc.)
 */
class JobService extends BaseService {
   constructor() {
      super('')
   }

   /**
    * Get job detail by job ID
    * GET /job/public/detail/{job_id}
    */
   async getJobDetail(jobId: number): Promise<JobDetail> {
      const response = await this.get<JobDetail>(`/job/public/detail/${jobId}`)
      return response.data
   }

   /**
    * Get multiple jobs by IDs
    */
   async getJobsByIds(jobIds: number[]): Promise<JobDetail[]> {
      const promises = jobIds.map((id) => this.getJobDetail(id))
      return Promise.all(promises)
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
