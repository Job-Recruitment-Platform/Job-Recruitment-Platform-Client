'use client'

import Button from '@/components/shared/Button'

interface DialogActionsProps {
   onCancel: () => void
   onSubmit: () => void
   isLoading?: boolean
   isDisabled?: boolean
}

export default function DialogActions({
   onCancel,
   onSubmit,
   isLoading = false,
   isDisabled = false
}: DialogActionsProps) {
   return (
      <div className='mt-6 flex gap-3 border-t pt-4'>
         <Button variant='ghost' onClick={onCancel} className='flex-1' disabled={isLoading}>
            Hủy
         </Button>
         <Button onClick={onSubmit} disabled={isDisabled || isLoading} className='flex-1'>
            {isLoading ? 'Đang xử lý...' : 'Nộp hồ sơ ứng tuyển'}
         </Button>
      </div>
   )
}
