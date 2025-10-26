'use client'

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { useState } from 'react'
import CVSelector from './CVSelector'
import CoverLetterInput from './CoverLetterInput'
import DialogActions from './DialogActions'

type SelectionMode = 'library' | 'upload'

interface ApplyJobDialogProps {
   job: {
      id: string | number
      title: string
      minSalary: number
      maxSalary: number
      currency: string
   }
   onApply?: (data: { cvId?: string; coverLetter: string; uploadedFile?: File }) => Promise<void>
   children?: React.ReactNode
}

export default function ApplyJobDialog({ job, onApply, children }: ApplyJobDialogProps) {
   const [selectionMode, setSelectionMode] = useState<SelectionMode>('library')
   const [selectedCV, setSelectedCV] = useState<string | null>(null)
   const [uploadedFile, setUploadedFile] = useState<File | null>(null)
   const [coverLetter, setCoverLetter] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [open, setOpen] = useState(false)

   const handleUploadSubmit = (data: { file: File }) => {
      setUploadedFile(data.file)
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

      setIsLoading(true)
      try {
         if (onApply) {
            await onApply({
               cvId: selectionMode === 'library' ? selectedCV! : undefined,
               coverLetter,
               uploadedFile: selectionMode === 'upload' ? uploadedFile! : undefined
            })
         }
         // Reset form
         setSelectedCV(null)
         setUploadedFile(null)
         setCoverLetter('')
         setSelectionMode('library')
         setOpen(false)
      } catch (error) {
         console.error('Lỗi khi ứng tuyển:', error)
         alert('Có lỗi xảy ra, vui lòng thử lại')
      } finally {
         setIsLoading(false)
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
                  onUploadSubmit={handleUploadSubmit}
               />

               {/* Cover Letter */}
               <CoverLetterInput value={coverLetter} onChange={setCoverLetter} />

               {/* Actions */}
               <DialogActions
                  onCancel={() => setOpen(false)}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  isDisabled={!isFormValid}
               />
            </div>
         </DialogContent>
      </Dialog>
   )
}
