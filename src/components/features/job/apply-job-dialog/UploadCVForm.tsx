'use client'

import Button from '@/components/shared/Button'
// import EmailFormField from '@/components/shared/EmailFormField'
// import FullNameFormField from '@/components/shared/FullNameFormField'
// import PhoneFormField from '@/components/shared/PhoneFormField'
// import { Form } from '@/components/ui/form'
// import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import * as z from 'zod'

// const uploadFormSchema = z.object({
//    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
//    email: z.string().email('Email không hợp lệ'),
//    phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số')
// })

// type UploadFormData = z.infer<typeof uploadFormSchema>

interface UploadCVFormProps {
   onSubmit: (data: { file: File }) => void
}

export default function UploadCVForm({ onSubmit }: UploadCVFormProps) {
   const [selectedFile, setSelectedFile] = useState<File | null>(null)

   // const form = useForm<UploadFormData>({
   //    resolver: zodResolver(uploadFormSchema),
   //    defaultValues: {
   //       fullName: '',
   //       email: '',
   //       phone: ''
   //    }
   // })

   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         const maxSize = 5 * 1024 * 1024 // 5MB
         if (file.size > maxSize) {
            alert('File quá lớn. Vui lòng chọn file dưới 5MB')
            return
         }
         setSelectedFile(file)
         // Auto submit when file is selected
         onSubmit({ file })
      }
   }

   return (
      <div className='space-y-4'>
         {/* File Upload */}
         <div className='rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-gray-400'>
            <Upload size={24} className='mx-auto mb-2 text-gray-400' />
            <p className='text-sm font-medium text-gray-700'>
               Tải lên CV từ máy tính, chọn hoặc kéo thả
            </p>
            <p className='mb-3 text-xs text-gray-600'>
               Hỗ trợ định dạng .doc, .docx, .pdf có kích thước dưới 5MB
            </p>

            <input
               type='file'
               accept='.doc,.docx,.pdf'
               className='hidden'
               id='cv-upload'
               onChange={handleFileSelect}
            />
            <div className='flex justify-center'>
               <label htmlFor='cv-upload' className='inline-block'>
                  <Button variant='primary' className='cursor-pointer' type='button'>
                     Chọn CV
                  </Button>
               </label>
            </div>

            {selectedFile && (
               <p className='mt-3 text-sm text-green-600'>✓ Đã chọn: {selectedFile.name}</p>
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
