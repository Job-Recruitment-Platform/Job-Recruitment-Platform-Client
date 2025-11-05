import { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { PaginationResponse } from '@/types/api.type.'
import type { JobSearchRequest, JobSearchResult } from '@/types/job.type'

/**
 * Search Service
 * Handles all search-related API calls (jobs, candidates, etc.)
 */
class SearchService extends BaseService {
   constructor() {
      super('/job/public')
   }

   async searchJobs(
      payload: JobSearchRequest
   ): Promise<ApiResponse<PaginationResponse<JobSearchResult>>> {
      const response = await this.post<PaginationResponse<JobSearchResult>>('/search', payload)
      console.log('Search Jobs Response:', response)
      return response
   }
}
// Export singleton instance
export const searchService = new SearchService()
