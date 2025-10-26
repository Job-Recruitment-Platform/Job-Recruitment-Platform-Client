'use client'

import Button from '@/components/shared/Button'
import { useFileUploader } from '@/hooks/useFileUploader'
import { Upload, X } from 'lucide-react'

interface UploadCVFormProps {
   onFileSelected?: (file: File | null) => void
}

export default function UploadCVForm({ onFileSelected }: UploadCVFormProps) {
   const {
      inputRef,
      dragActive,
      items,
      onBrowseClick,
      onInputChange,
      onDrop,
      onDragOver,
      onDragLeave,
      removeItem
   } = useFileUploader({
      accept: ['.doc', '.docx', '.pdf'],
      maxSizeMB: 5,
      multiple: false,
      fieldName: 'cv'
   })

   const selectedFile = items.length > 0 ? items[0] : null

   // Notify parent when file changes
   const handleRemoveFile = (id: string) => {
      removeItem(id)
      onFileSelected?.(null)
   }

   // Watch for file selection changes
   if (selectedFile && selectedFile.state !== 'error') {
      onFileSelected?.(selectedFile.file)
   } else if (!selectedFile) {
      onFileSelected?.(null)
   }

   return (
      <div className='space-y-4'>
         {/* Hidden Input */}
         <input
            ref={inputRef}
            type='file'
            accept='.doc,.docx,.pdf'
            className='hidden'
            onChange={onInputChange}
         />

         {/* File Upload Area */}
         <div
            className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
               dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={onBrowseClick}
         >
            <Upload
               size={24}
               className={`mx-auto mb-2 ${dragActive ? 'text-green-500' : 'text-gray-400'}`}
            />
            <p className='text-sm font-medium text-gray-700'>
               Tải lên CV từ máy tính, chọn hoặc kéo thả
            </p>
            <p className='mb-3 text-xs text-gray-600'>
               Hỗ trợ định dạng .doc, .docx, .pdf có kích thước dưới 5MB
            </p>

            <div className='flex justify-center' onClick={(e) => e.stopPropagation()}>
               <Button
                  variant='primary'
                  className='cursor-pointer'
                  type='button'
                  onClick={onBrowseClick}
               >
                  Chọn CV
               </Button>
            </div>

            {selectedFile && (
               <div className='mt-3 flex items-center justify-center gap-2'>
                  {selectedFile.state === 'error' ? (
                     <p className='text-sm text-red-600'>✗ {selectedFile.error}</p>
                  ) : (
                     <>
                        <p className='text-sm text-green-600'>
                           ✓ Đã chọn: {selectedFile.file.name}
                        </p>
                        <button
                           onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveFile(selectedFile.id)
                           }}
                           className='text-xs text-red-500 underline hover:text-red-700'
                           type='button'
                        >
                           <X size={14} className='inline' /> Xóa
                        </button>
                     </>
                  )}
               </div>
            )}
         </div>

         {/* Required Info Form - Commented for future use */}
         {/* <div className='border-t-2 border-dashed border-green-300 pt-4'>
            <p className='mb-1 text-sm font-medium text-green-600'>
               Vui lòng nhập đầy đủ thông tin chi tiết:
            </p>
            <p className='mb-4 text-xs text-red-500'>(*) Thông tin bắt buộc.</p>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
                  <FullNameFormField
                     control={form.control}
                     name='fullName'
                     label='Họ và tên *'
                     placeholder='Họ tên hiển thị với NTD'
                     className='w-full'
                  />

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                     <EmailFormField
                        control={form.control}
                        name='email'
                        label='Email *'
                        placeholder='Email hiển thị với NTD'
                     />

                     <PhoneFormField
                        control={form.control}
                        name='phone'
                        label='Số điện thoại *'
                        placeholder='Số điện thoại hiển thị với NTD'
                     />
                  </div>

                  <div className='flex gap-3 pt-2'>
                     <Button type='button' variant='ghost' onClick={onCancel} className='flex-1'>
                        Hủy
                     </Button>
                     <Button
                        type='submit'
                        disabled={!selectedFile}
                        className='flex-1 !text-white bg-green-600 hover:bg-green-700'
                     >
                        Xác nhận
                     </Button>
                  </div>
               </form>
            </Form>
         </div> */}
      </div>
   )
}
