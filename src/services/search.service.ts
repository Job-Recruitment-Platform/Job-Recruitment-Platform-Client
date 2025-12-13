import { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { PaginationResponse } from '@/types/api.type.'
import { mockJobSearchResult } from '@/types/data'
import type { JobSearchRequest, JobSearchResult } from '@/types/job.type'

/**
 * Search Service
 * Handles all search-related API calls (jobs, candidates, etc.)
 */
class SearchService extends BaseService {
   constructor() {
      super('/jobs/public')
   }

   async searchJobs(
      payload: JobSearchRequest
   ): Promise<ApiResponse<PaginationResponse<JobSearchResult[]>>> {
      const response = await this.post<PaginationResponse<JobSearchResult[]>>('/search', payload)
      return response
   }
}
// Export singleton instance
export const searchService = new SearchService()
