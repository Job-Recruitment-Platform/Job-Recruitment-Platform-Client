import { searchService } from '@/services/search.service'
import { useMutation } from '@tanstack/react-query'

export const useSearchJob = () => {
   const jobSearchResult = useMutation({
      mutationFn: searchService.searchJobs,
      onSuccess: (data) => {
         console.log('Search Jobs Success:', data)
      },
      onError: (error) => {
         console.error('Search Jobs Error:', error)
      }
   })

   return {
      
   }
}
