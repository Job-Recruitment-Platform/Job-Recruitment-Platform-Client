import Button from '@/components/shared/Button'
import { ApiError } from '@/lib/axios'
import { showErrorToast, showInfoToast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import candidateService from '@/services/candidate.service'
import { useSavedJobsStore } from '@/store/useSavedJobStore'
import { Heart } from 'lucide-react'

type SavedJobButtonProps = {
   jobId: number
   className?: string
   children?: React.ReactNode
   onClick?: () => void
}

const isApiError = (error: unknown): error is ApiError => {
   return error instanceof Error && error.name === 'ApiError'
}

export default function SavedJobButton({
   className,
   jobId,
   children,
   onClick
}: SavedJobButtonProps) {
   const isSaved = useSavedJobsStore((state) => state.jobs.some((j) => j.job.id === jobId))

   const handleToggleSave = async () => {
      onClick?.()
      try {
         if (isSaved) {
            await candidateService.removeSavedJob(jobId)
         } else {
            await candidateService.saveJob(jobId)
         }
      } catch (error) {
         if (isApiError(error) && error.code === 409) {
            showInfoToast('Bạn đã lưu công việc này rồi')
         } else {
            showErrorToast((error as Error).message || 'Có lỗi xảy ra, vui lòng thử lại')
         }
      }
   }

   return (
      <Button
         variant='outline'
         className={cn('text-primary', className)}
         onClick={handleToggleSave}
      >
         <Heart size={16} fill={isSaved ? '#00b14f' : 'none'} />
         {children}
      </Button>
   )
}
