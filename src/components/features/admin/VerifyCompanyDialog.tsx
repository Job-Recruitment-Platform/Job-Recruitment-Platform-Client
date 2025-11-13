'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { companyService } from '@/services/company.service'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import Button from '@/components/shared/Button'
import { CheckCircle, XCircle } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

interface VerifyCompanyDialogProps {
   companyId: number
   companyName: string
   open: boolean
   onClose: () => void
}

export default function VerifyCompanyDialog({
   companyId,
   companyName,
   open,
   onClose
}: Readonly<VerifyCompanyDialogProps>) {
   const [decision, setDecision] = useState<'approve' | 'reject' | null>(null)
   const [reason, setReason] = useState('')

   const verifyMutation = useMutation({
      mutationFn: async () => {
         if (!decision) throw new Error('Vui lòng chọn quyết định')
         if (decision === 'reject' && !reason.trim()) {
            throw new Error('Vui lòng nhập lý do từ chối')
         }

         return await companyService.verifyAttestion({
            companyId,
            approved: decision === 'approve',
            reason: decision === 'reject' ? reason : undefined
         })
      },
      onSuccess: () => {
         showSuccessToast(
            decision === 'approve'
               ? 'Công ty đã được xác thực thành công'
               : 'Đã từ chối xác thực công ty'
         )
         setDecision(null)
         setReason('')
         onClose()
      },
      onError: (error: any) => {
         showErrorToast(error.message || 'Có lỗi xảy ra khi xét duyệt')
      }
   })

   const handleSubmit = () => {
      verifyMutation.mutate()
   }

   const handleClose = () => {
      if (!verifyMutation.isPending) {
         setDecision(null)
         setReason('')
         onClose()
      }
   }

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent className='max-w-md'>
            <DialogHeader>
               <DialogTitle>Xét duyệt công ty</DialogTitle>
            </DialogHeader>

            <div className='space-y-4'>
               <div>
                  <p className='text-sm text-gray-600'>
                     Bạn đang xét duyệt công ty:{' '}
                     <span className='font-semibold text-gray-900'>{companyName}</span>
                  </p>
               </div>

               {/* Decision Buttons */}
               <div className='grid grid-cols-2 gap-3'>
                  <button
                     onClick={() => setDecision('approve')}
                     className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        decision === 'approve'
                           ? 'border-green-500 bg-green-50 text-green-700'
                           : 'border-gray-200 hover:border-green-300'
                     }`}
                  >
                     <CheckCircle size={20} />
                     <span className='font-medium'>Phê duyệt</span>
                  </button>
                  <button
                     onClick={() => setDecision('reject')}
                     className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        decision === 'reject'
                           ? 'border-red-500 bg-red-50 text-red-700'
                           : 'border-gray-200 hover:border-red-300'
                     }`}
                  >
                     <XCircle size={20} />
                     <span className='font-medium'>Từ chối</span>
                  </button>
               </div>

               {/* Rejection Reason */}
               {decision === 'reject' && (
                  <div className='space-y-2'>
                     <div className='text-sm font-medium'>
                        Lý do từ chối <span className='text-red-500'>*</span>
                     </div>
                     <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder='Nhập lý do từ chối để nhà tuyển dụng biết và chỉnh sửa...'
                        rows={4}
                        className='resize-none'
                     />
                  </div>
               )}

               {/* Action Buttons */}
               <div className='flex items-center justify-end gap-3 pt-2'>
                  <Button
                     type='button'
                     variant='outline'
                     onClick={handleClose}
                     disabled={verifyMutation.isPending}
                  >
                     Hủy
                  </Button>
                  <Button
                     type='button'
                     variant='primary'
                     onClick={handleSubmit}
                     disabled={!decision || verifyMutation.isPending}
                  >
                     {verifyMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   )
}
