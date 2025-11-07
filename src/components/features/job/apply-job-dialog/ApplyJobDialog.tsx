'use client'

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { useApplyJob } from '@/hooks/useCandidate'
import { useState } from 'react'
import CVSelector from './CVSelector'
import CoverLetterInput from './CoverLetterInput'
import DialogActions from './DialogActions'
import toast from 'react-hot-toast'
import { useLogStore } from '@/hooks/useTracker'

type SelectionMode = 'library' | 'upload'

interface ApplyJobDialogProps {
   job: {
      id: number
      title: string
      minSalary: number
      maxSalary: number
      currency: string
   }
   onSuccess?: () => void
   children?: React.ReactNode
}

export default function ApplyJobDialog({ job, onSuccess, children }: ApplyJobDialogProps) {
   const [selectionMode, setSelectionMode] = useState<SelectionMode>('library')
   const [selectedCV, setSelectedCV] = useState<string | null>(null)
   const [uploadedFile, setUploadedFile] = useState<File | null>(null)
   const [coverLetter, setCoverLetter] = useState('')
   const [open, setOpen] = useState(false)
   const { markApply } = useLogStore()

   // Use TanStack Query mutation
   const { mutate: applyJob, isPending } = useApplyJob({
      onSuccess: (data) => {
         console.log('✅ Apply job success data:', data)
         toast.success('Ứng tuyển thành công!')

         markApply(job.id)

         // Reset form
         setSelectedCV(null)
         setUploadedFile(null)
         setCoverLetter('')
         setSelectionMode('library')
         setOpen(false)

         onSuccess?.()
      },
      onError: (error) => {
         console.error('❌ Lỗi khi ứng tuyển:', error)
         console.log('❌ Error details:', {
            message: error.message,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response: (error as any)?.response,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            responseData: (error as any)?.response?.data
         })
         const errorMessage =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any)?.response?.data?.message ||
            error.message ||
            'Có lỗi xảy ra, vui lòng thử lại'
         alert(errorMessage)
      }
   })

   const handleFileSelected = (file: File | null) => {
      setUploadedFile(file)
   }

   const handleSubmit = async () => {
      // Validate based on selection mode
      if (selectionMode === 'library' && !selectedCV) {
         alert('Vui lòng chọn CV từ thư viện')
         return
      }

      if (selectionMode === 'upload' && !uploadedFile) {
         alert('Vui lòng tải lên CV')
         return
      }

      // TODO: Handle library CV selection
      // For now, only handle file upload
      if (selectionMode === 'upload' && uploadedFile) {
         applyJob({
            jobId: job.id,
            file: uploadedFile,
            coverLetter: coverLetter || undefined
         })
      }
   }

   const isFormValid =
      (selectionMode === 'library' && selectedCV) || (selectionMode === 'upload' && uploadedFile)

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent className='max-h-[90vh] max-w-2xl min-w-2xl'>
            <DialogHeader>
               <div className='flex items-start justify-between gap-4'>
                  <div>
                     <DialogTitle className='text-lg font-bold text-green-600'>
                        Ứng tuyển {job.title}
                     </DialogTitle>
                     <p className='mt-1 text-xs text-gray-500'>
                        (Thu nhập {job.minSalary} - {job.maxSalary} {job.currency}/Tháng)
                     </p>
                  </div>
               </div>
            </DialogHeader>

            <div className='max-h-[45rem] space-y-6 overflow-y-auto py-4'>
               {/* CV Selection */}
               <CVSelector
                  selectedMode={selectionMode}
                  selectedCV={selectedCV}
                  onModeChange={(mode) => {
                     setSelectionMode(mode)
                     // Reset states when changing mode
                     if (mode === 'library') {
                        setUploadedFile(null)
                     } else {
                        setSelectedCV(null)
                     }
                  }}
                  onCVSelect={setSelectedCV}
                  onFileSelected={handleFileSelected}
               />

               {/* Cover Letter */}
               <CoverLetterInput value={coverLetter} onChange={setCoverLetter} />

               {/* Actions */}
               <DialogActions
                  onCancel={() => setOpen(false)}
                  onSubmit={handleSubmit}
                  isLoading={isPending}
                  isDisabled={!isFormValid}
               />
            </div>
         </DialogContent>
      </Dialog>
   )
}
