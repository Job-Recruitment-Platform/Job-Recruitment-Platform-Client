'use client'

import AddressFields from '@/components/shared/AddressFields'
import Button from '@/components/shared/Button'
import FormWrapper from '@/components/shared/FormWrapper'
import PreferencesFields from '@/components/shared/PreferencesFields'
import SalaryRangeFields from '@/components/shared/SalaryRangeFields'
import SenioritySelect from '@/components/shared/SenioritySelect'
import SkillsFieldArray from '@/components/shared/SkillsFieldArray'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { showSuccessToast } from '@/lib/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Upload } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const skillSchema = z.object({
   skillName: z.string().min(1, 'Bắt buộc'),
   level: z.number().min(1).max(5)
})

const formSchema = z.object({
   fullName: z.string().min(1, 'Bắt buộc'),
   location: z.object({
      streetAddress: z.string().min(1, 'Bắt buộc'),
      ward: z.string().min(1, 'Bắt buộc'),
      provinceCity: z.string().min(1, 'Bắt buộc')
   }),
   seniority: z.string().min(1, 'Bắt buộc'),
   salaryExpectMin: z.number(),
   salaryExpectMax: z.number(),
   currency: z.string().min(1, 'Bắt buộc'),
   remotePref: z.boolean(),
   relocationPref: z.boolean(),
   bio: z.string().optional(),
   skills: z.array(skillSchema).min(1, 'Thêm ít nhất 1 kỹ năng')
})

type FormValues = z.infer<typeof formSchema>

export default function EditProfilePage() {
   const [saving, setSaving] = useState(false)
   const [avatarPreview, setAvatarPreview] = useState(
      'https://www.topcv.vn/images/avatar-default.jpg'
   )

   const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         fullName: 'Hoang Phi Long',
         location: {
            streetAddress: 'Nguyen An Ninh',
            ward: 'Di An',
            provinceCity: 'Ho Chi Minh City'
         },
         seniority: 'INTERN',
         salaryExpectMin: 100,
         salaryExpectMax: 9000,
         currency: 'VND',
         remotePref: true,
         relocationPref: false,
         bio: 'My bio',
         skills: [
            { skillName: 'Analyst', level: 4 },
            { skillName: 'Backend', level: 5 }
         ]
      }
   })

   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         const reader = new FileReader()
         reader.onloadend = () => setAvatarPreview(reader.result as string)
         reader.readAsDataURL(file)
      }
   }

   const onSubmit = async (data: FormValues) => {
      setSaving(true)
      try {
         // TODO: call profile update API
         await new Promise((r) => setTimeout(r, 800))
         console.log('Submit data:', data)
         showSuccessToast('Cập nhật hồ sơ thành công')
      } finally {
         setSaving(false)
      }
   }

   return (
      <div className='bg-smoke min-h-screen py-6'>
         <div className='container mx-auto px-4'>
            <div className='mx-auto max-w-4xl'>
               <div className='mb-6 flex items-center justify-between'>
                  <div>
                     <h1 className='text-2xl font-semibold'>Chỉnh sửa hồ sơ</h1>
                     <p className='text-sm text-gray-500'>Cập nhật thông tin cá nhân của bạn</p>
                  </div>
                  <Link href='/(candidate)/profile'>
                     <Button variant='outline'>Quay lại</Button>
                  </Link>
               </div>

               <FormWrapper<FormValues, FormValues>
                  form={form}
                  onSubmit={onSubmit}
                  className='space-y-6'
               >
                  {/* Avatar Section */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>Ảnh đại diện</h2>
                     <div className='flex items-center gap-6'>
                        <div className='relative'>
                           <Avatar className='h-24 w-24'>
                              <AvatarImage src={avatarPreview} />
                              <AvatarFallback className='text-2xl'>NV</AvatarFallback>
                           </Avatar>
                           <label
                              htmlFor='avatar-upload'
                              className='bg-primary absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white hover:opacity-90'
                           >
                              <Camera size={16} />
                           </label>
                           <input
                              id='avatar-upload'
                              type='file'
                              accept='image/*'
                              className='hidden'
                              onChange={handleAvatarChange}
                           />
                        </div>
                        <div className='flex-1'>
                           <p className='mb-2 text-sm font-medium'>Tải ảnh đại diện của bạn</p>
                           <p className='text-xs text-gray-500'>
                              JPG, PNG hoặc GIF. Kích thước tối đa 5MB.
                           </p>
                        </div>
                     </div>
                  </section>

                  {/* Basic Information */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>Thông tin cơ bản</h2>
                     <div className='grid gap-4 sm:grid-cols-2'>
                        <FormField
                           control={form.control}
                           name={'fullName'}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Họ và tên</FormLabel>
                                 <FormControl>
                                    <Input placeholder='Nguyễn Văn A' {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <AddressFields />
                     </div>
                  </section>

                  {/* Professional Information */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>Thông tin nghề nghiệp</h2>
                     <div className='space-y-4'>
                        <SenioritySelect control={form.control} name={'seniority'} />
                        <SalaryRangeFields control={form.control} />
                        <PreferencesFields
                           control={form.control}
                           remoteName={'remotePref'}
                           relocateName={'relocationPref'}
                        />
                        <SkillsFieldArray name={'skills'} />
                     </div>
                  </section>

                  {/* About Me */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>Giới thiệu bản thân</h2>
                     <FormField
                        control={form.control}
                        name={'bio'}
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <Textarea
                                    rows={6}
                                    placeholder='Giới thiệu bản thân...'
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </section>

                  {/* Resume Upload */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>CV / Resume</h2>
                     <div className='flex items-center gap-4'>
                        <label
                           htmlFor='resume-upload'
                           className='border-primary bg-primary/5 text-primary hover:bg-primary/10 flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium'
                        >
                           <Upload size={16} />
                           Tải lên CV
                        </label>
                        <input
                           id='resume-upload'
                           type='file'
                           accept='.pdf,.doc,.docx'
                           className='hidden'
                        />
                        <span className='text-sm text-gray-500'>Chưa có file nào được chọn</span>
                     </div>
                     <p className='mt-2 text-xs text-gray-500'>
                        Chấp nhận file PDF, DOC, DOCX. Kích thước tối đa 10MB.
                     </p>
                  </section>

                  {/* Action Buttons */}
                  <div className='flex items-center justify-end gap-3'>
                     <Link href='/(candidate)/profile'>
                        <Button type='button' variant='outline' disabled={saving}>
                           Hủy
                        </Button>
                     </Link>
                     <Button type='submit' variant='primary' disabled={saving}>
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                     </Button>
                  </div>
               </FormWrapper>
            </div>
         </div>
      </div>
   )
}
