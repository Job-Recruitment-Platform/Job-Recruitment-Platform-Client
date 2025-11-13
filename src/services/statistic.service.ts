import { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { AdminStatisticResponse, StatisticResponse } from '@/types/statistic.type'

/**
 * Statistic Service
 * Handles all statistic-related API calls (jobs, candidates, etc.)
 */
class StatisticService extends BaseService {
   constructor() {
      super('/statistics')
   }

   async getStatistics(): Promise<ApiResponse<StatisticResponse>> {
      return await this.get<StatisticResponse>('/recruiter', {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
         }
      })
   }

   async getAdminStatistics(): Promise<AdminStatisticResponse> {
      const response = await this.get<AdminStatisticResponse>('/admin')
      return response.data
   }
}

export const statisticService = new StatisticService()
