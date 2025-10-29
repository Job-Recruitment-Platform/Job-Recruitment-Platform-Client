import { ApiResponse } from '@/lib/axios'
import { BaseService } from '@/services/base.service'
import { StatisticResponse } from '@/types/statistic.type'

/**
 * Statistic Service
 * Handles all statistic-related API calls (jobs, candidates, etc.)
 */
class StatisticService extends BaseService {
   constructor() {
        super('/statistics')
   }

   async getStatistics(): Promise<ApiResponse<StatisticResponse>> {
      return await this.get<StatisticResponse>('', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      })
   }
}

export const statisticService = new StatisticService()