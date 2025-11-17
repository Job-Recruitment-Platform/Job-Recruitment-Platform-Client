import { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { PaginationResponse } from '@/types/api.type.'
import { mockJobSearchResult } from '@/types/data'
import type { JobSearchResult } from '@/types/job.type'

/**
 * Search Service
 * Handles all search-related API calls (jobs, candidates, etc.)
 */
class SearchService extends BaseService {
   constructor() {
      super('/job/public')
   }

   async searchJobs(): Promise<ApiResponse<PaginationResponse<JobSearchResult[]>>> {
      // Return mock data for development/testing
      const mockResponse: ApiResponse<PaginationResponse<JobSearchResult[]>> = {
         code: 200,
         message: 'Success',
         data: {
            page: 1,
            size: 10,
            totalElements: mockJobSearchResult.length,
            totalPages: 1,
            first: true,
            last: true,
            hasNext: false,
            hasPrevious: false,
            content: mockJobSearchResult
         }
      }
      console.log('Search Jobs Response:', mockResponse)
      return mockResponse

      // Uncomment below to use actual API with payload
      // const response = await this.post<PaginationResponse<JobSearchResult[]>>('/search', payload)
      // console.log('Search Jobs Response:', response)
      // return response
   }
}
// Export singleton instance
export const searchService = new SearchService()
