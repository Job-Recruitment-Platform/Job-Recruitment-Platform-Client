import type { ApplyJobRequest, ApplyJobResponse } from '@/services/candidate.service'
import candidateService from '@/services/candidate.service'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

/**
 * Custom hook to apply for a job using TanStack Query mutation
 *
 * @example
 * const { mutate, isPending, isSuccess, isError, error } = useApplyJob({
 *   onSuccess: () => {
 *     toast.success('Applied successfully!')
 *   },
 *   onError: (error) => {
 *     toast.error(error.message)
 *   }
 * })
 *
 * // Usage
 * mutate({
 *   jobId: 123,
 *   file: uploadedFile,
 *   coverLetter: 'I am interested...'
 * })
 */
export const useApplyJob = (options?: {
   onSuccess?: (data: ApplyJobResponse) => void
   onError?: (error: Error) => void
}) => {
   return useMutation({
      mutationFn: async (data: ApplyJobRequest) => {
         const response = await candidateService.applyForJob(data)
         console.log('✅ Server response:', response)
         return response
      },
      onSuccess: (data) => {
         options?.onSuccess?.(data)
      },
      onError: (error: Error) => {
         options?.onError?.(error)
      }
   })
}

/**
 * Type for the apply job mutation result
 */
export type UseApplyJobResult = UseMutationResult<ApplyJobResponse, Error, ApplyJobRequest, unknown>

/**
 * Re-export for convenience
 */
export type { ApplyJobRequest, ApplyJobResponse }

export const useCandidate = () => {
   const applyJob = useApplyJob()
   return {
      applyJob
   }
}
