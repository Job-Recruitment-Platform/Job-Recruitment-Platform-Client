'use client'

import Button from '@/components/shared/Button'
import FullNameFormField from '@/components/shared/FullNameFormField'
import PhoneFormField from '@/components/shared/PhoneFormField'
import FormWrapper from '@/components/shared/FormWrapper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { recruiterService } from '@/services/recruiter.service'
import { resourceService } from '@/services/resource.service'
import {
   RecruiterResponse,
   UpdateRecruiterProfileRequest
} from '@/types/recruiter.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Camera, Loader2, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
   fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
   phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số')
})

export default function RecruiterProfileSettingsPage() {
   const queryClient = useQueryClient()
   const [avatarPreview, setAvatarPreview] = useState<string>('')
   const [defaultValues, setDefaultValues] = useState<UpdateRecruiterProfileRequest | null>(null)

   const mapProfileToForm = (p: RecruiterResponse): UpdateRecruiterProfileRequest => ({
      fullName: p.fullName || '',
      phone: p.phone || ''
   })

   const form = useForm<UpdateRecruiterProfileRequest>({
      resolver: zodResolver(formSchema),
      defaultValues: defaultValues || {
         fullName: '',
         phone: ''
      }
   })

   // Fetch recruiter profile
   const { data, isLoading } = useQuery({
      queryKey: ['recruiter-profile'],
      queryFn: () => recruiterService.getProfile(),
      refetchOnWindowFocus: false
   })

   const recruiterData = data?.data

   // Load profile data into form
   useEffect(() => {
      if (recruiterData) {
         const formValues = mapProfileToForm(recruiterData)
         setDefaultValues(formValues)
         form.reset(formValues)

         // Set avatar preview
         if (recruiterData.resource?.url) {
            setAvatarPreview(recruiterData.resource.url)
         }
      }
   }, [recruiterData, form])

   // Upload avatar mutation
   const uploadAvatarMutation = useMutation({
      mutationFn: (file: File) => resourceService.uploadAvatar(file),
      onSuccess: (response) => {
         setAvatarPreview(response.data.url)
         queryClient.invalidateQueries({ queryKey: ['recruiter-profile'] })
         showSuccessToast('Cập nhật ảnh đại diện thành công')
      },
      onError: (error: any) => {
         showErrorToast(error?.message || 'Không thể tải ảnh đại diện lên')
      }
   })

   // Update profile mutation
   const updateMutation = useMutation({
      mutationFn: (data: UpdateRecruiterProfileRequest) => recruiterService.updateProfile(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['recruiter-profile'] })
         showSuccessToast('Cập nhật hồ sơ thành công')
      },
      onError: (error: any) => {
         showErrorToast(error?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ')
      }
   })

   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         // Validate file size (5MB)
         if (file.size > 5 * 1024 * 1024) {
            showErrorToast('Kích thước file không được vượt quá 5MB')
            return
         }

         // Validate file type
         if (!file.type.startsWith('image/')) {
            showErrorToast('Vui lòng chọn file ảnh')
            return
         }

         // Show preview immediately
         const reader = new FileReader()
         reader.onloadend = () => {
            setAvatarPreview(reader.result as string)
         }
         reader.readAsDataURL(file)

         // Upload to server
         uploadAvatarMutation.mutate(file)
      }
   }

   const onSubmit = async (data: UpdateRecruiterProfileRequest) => {
      updateMutation.mutate(data)
   }

   if (isLoading) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
         </div>
      )
   }

   return (
      <div className='space-y-6'>
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
               <User size={18} />
               <div className='text-xl font-semibold'>Hồ sơ nhà tuyển dụng</div>
            </div>
         </div>

         <FormWrapper form={form} onSubmit={onSubmit} className='space-y-6'>
            {/* Avatar Section */}
            <section className='rounded-md border bg-white p-6'>
               <h2 className='mb-4 text-sm font-semibold'>Ảnh đại diện</h2>
               <div className='flex items-start gap-6'>
                  <div className='relative'>
                     <Avatar className='h-24 w-24'>
                        <AvatarImage src={avatarPreview} className='object-cover' />
                        <AvatarFallback className='bg-primary/10 text-primary text-2xl font-semibold'>
                           {recruiterData?.fullName?.charAt(0) || 'R'}
                        </AvatarFallback>
                     </Avatar>
                     {uploadAvatarMutation.isPending ? (
                        <div className='absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md'>
                           <Loader2 size={14} className='animate-spin' />
                        </div>
                     ) : (
                        <label
                           htmlFor='recruiter-avatar-upload'
                           className='absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md hover:opacity-90'
                        >
                           <Camera size={14} />
                        </label>
                     )}
                     <input
                        id='recruiter-avatar-upload'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleAvatarChange}
                        disabled={uploadAvatarMutation.isPending}
                     />
                  </div>
                  <div className='flex-1'>
                     <p className='mb-2 text-sm font-medium'>Tải lên ảnh đại diện của bạn</p>
                     <p className='text-xs text-gray-500'>
                        JPG, PNG hoặc GIF. Kích thước tối đa 5MB. Khuyến nghị: 400x400px
                     </p>
                     {uploadAvatarMutation.isPending && (
                        <p className='mt-2 text-xs text-primary'>Đang tải lên...</p>
                     )}
                  </div>
               </div>
            </section>

            {/* Basic Information Section */}
            <section className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Thông tin cơ bản</div>
               <div className='grid gap-4 p-4 sm:grid-cols-2'>
                  <FullNameFormField control={form.control} name='fullName' />
                  <PhoneFormField control={form.control} name='phone' />
               </div>
            </section>

            {/* Company Information (Read-only) */}
            {recruiterData?.company && (
               <section className='rounded-md border bg-white'>
                  <div className='border-b p-4 text-sm font-semibold'>Thông tin công ty</div>
                  <div className='space-y-3 p-4'>
                     <div className='flex items-center gap-3'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-md bg-gray-100'>
                           {recruiterData.company.resource?.url ? (
                              <img
                                 src={recruiterData.company.resource.url}
                                 alt={recruiterData.company.name}
                                 className='h-full w-full rounded-md object-cover'
                              />
                           ) : (
                              <User size={20} className='text-gray-400' />
                           )}
                        </div>
                        <div className='flex-1'>
                           <div className='font-medium'>{recruiterData.company.name}</div>
                           <div className='text-sm text-gray-500'>{recruiterData.company.industry}</div>
                        </div>
                     </div>
                     {recruiterData.company.website && (
                        <div className='text-sm text-gray-600'>
                           <span className='font-medium'>Website: </span>
                           <a
                              href={recruiterData.company.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-primary hover:underline'
                           >
                              {recruiterData.company.website}
                           </a>
                        </div>
                     )}
                     <div className='rounded-md bg-blue-50 p-3 text-sm text-blue-700'>
                        <p className='mb-1 font-medium'>💡 Muốn cập nhật thông tin công ty?</p>
                        <p className='text-xs'>
                           Vui lòng truy cập{' '}
                           <Link href='/recruiter/settings/company' className='font-semibold underline'>
                              Hồ sơ công ty
                           </Link>{' '}
                           để chỉnh sửa.
                        </p>
                     </div>
                  </div>
               </section>
            )}

            {/* Action Buttons */}
            <div className='flex items-center justify-end gap-3'>
               <Link href='/recruiter/dashboard'>
                  <Button type='button' variant='outline' disabled={updateMutation.isPending}>
                     Hủy
                  </Button>
               </Link>
               <Button type='submit' variant='primary' disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
               </Button>
            </div>
         </FormWrapper>
      </div>
   )
}

