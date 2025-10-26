'use client'

import { Upload } from 'lucide-react'
import UploadCVForm from './UploadCVForm'

interface CV {
   id: string
   name: string
}

type SelectionMode = 'library' | 'upload'

interface CVSelectorProps {
   selectedMode: SelectionMode
   selectedCV: string | null
   onModeChange: (mode: SelectionMode) => void
   onCVSelect: (cvId: string) => void
   onUploadSubmit: (data: { file: File }) => void
   cvList?: CV[]
}

export default function CVSelector({
   selectedMode,
   selectedCV,
   onModeChange,
   onCVSelect,
   onUploadSubmit,
   cvList = []
}: CVSelectorProps) {
   return (
      <div className='space-y-4'>
         <div className='flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-sm text-white'>
               ✓
            </div>
            <h3 className='font-semibold text-gray-800'>Chọn CV để ứng tuyển</h3>
         </div>

         <div className='space-y-3 rounded-lg border border-green-300 bg-green-50/50 p-4'>
            {/* Library Selection */}
            <div
               className={`flex cursor-pointer items-start gap-3 rounded-lg border bg-white p-3 transition ${
                  selectedMode === 'library' ? 'border-green-500' : 'border-gray-200'
               }`}
               onClick={() => onModeChange('library')}
            >
               <input
                  type='radio'
                  name='cv-mode'
                  checked={selectedMode === 'library'}
                  onChange={() => onModeChange('library')}
                  className='mt-1 cursor-pointer'
               />
               <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-700'>
                     Chọn CV khác trong thư viện CV của tôi
                  </p>

                  {selectedMode === 'library' && (
                     <div className='mt-2 space-y-2'>
                        {cvList.length === 0 ? (
                           <p className='text-sm text-gray-500'>
                              Bạn chưa có CV nào trong thư viện.
                           </p>
                        ) : (
                           <>
                              <p className='mt-1 text-xs text-gray-600'>CV Online</p>
                              {cvList.map((cv) => (
                                 <label
                                    key={cv.id}
                                    className='flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50'
                                 >
                                    <input
                                       type='radio'
                                       name='selected-cv'
                                       checked={selectedCV === cv.id}
                                       onChange={() => onCVSelect(cv.id)}
                                       className='cursor-pointer'
                                    />
                                    <span className='text-sm text-gray-700'>{cv.name}</span>
                                 </label>
                              ))}
                           </>
                        )}
                     </div>
                  )}
               </div>
            </div>

            {/* Upload Selection */}
            <div
               className={`rounded-lg border bg-white transition ${
                  selectedMode === 'upload' ? 'border-green-500' : 'border-gray-200'
               }`}
            >
               <div className='flex cursor-pointer items-start gap-3 p-3'>
                  <input
                     type='radio'
                     name='cv-mode'
                     checked={selectedMode === 'upload'}
                     onChange={() => onModeChange('upload')}
                     className='mt-1 flex-shrink-0 cursor-pointer'
                     onClick={(e) => e.stopPropagation()}
                  />
                  <div className='flex-1'>
                     <div
                        className='flex cursor-pointer items-center gap-2'
                        onClick={() => onModeChange('upload')}
                     >
                        <Upload size={18} className='text-gray-600' />
                        <p className='text-sm font-medium text-gray-700'>
                           Tải lên CV từ máy tính, chọn hoặc kéo thả
                        </p>
                     </div>
                     <p className='mt-1 text-xs text-gray-600'>
                        Hỗ trợ định dạng .doc, .docx, .pdf có kích thước dưới 5MB
                     </p>
                  </div>
               </div>

               {selectedMode === 'upload' && (
                  <div className='w-full px-3 pb-3'>
                     <UploadCVForm onSubmit={onUploadSubmit} />
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
