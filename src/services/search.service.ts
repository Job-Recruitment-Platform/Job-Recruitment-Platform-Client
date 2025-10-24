import { searchApiClient } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import type { JobSearchRequest, JobSearchResponse } from '@/types/job.type'

/**
 * Search Service
 * Handles all search-related API calls (jobs, candidates, etc.)
 */
class SearchService extends BaseService {
   constructor() {
      super('', searchApiClient)
   }

   /**
    * Search for jobs based on query and filters
    * POST /search
    */
   async searchJobs(payload: JobSearchRequest): Promise<JobSearchResponse> {
      const response = await this.post<JobSearchResponse>('/search', payload)
      return response.data || response
   }

   /**
    * Search for jobs with pagination
    */
   async searchJobsWithPagination(
      query: string,
      limit: number = 10,
      offset: number = 0
   ): Promise<JobSearchResponse> {
      return this.searchJobs({
         query,
         limit,
         offset
      })
   }

   /**
    * Search for jobs with custom filters
    */
   async searchJobsWithFilters(
      query: string,
      filters: {
         work_mode?: 'ONSITE' | 'REMOTE' | 'HYBRID'
         seniority?: 'JUNIOR' | 'SENIOR' | 'LEAD'
      },
      limit: number = 10,
      offset: number = 0
   ): Promise<JobSearchResponse> {
      return this.searchJobs({
         query,
         limit,
         offset,
         filters
      })
   }

   /**
    * Search for jobs with semantic search weights
    */
   async searchJobsWithWeights(
      query: string,
      weights: {
         dense?: number
         sparse?: number
      } = { dense: 0.7, sparse: 0.3 },
      limit: number = 10,
      offset: number = 0
   ): Promise<JobSearchResponse> {
      return this.searchJobs({
         query,
         limit,
         offset,
         weights
      })
   }
}

// Export singleton instance
export const searchService = new SearchService()
