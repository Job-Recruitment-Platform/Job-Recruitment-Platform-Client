'use client'

import AddressFields from '@/components/shared/AddressFields'
import Button from '@/components/shared/Button'
import FormWrapper from '@/components/shared/FormWrapper'
import FullNameFormField from '@/components/shared/FullNameFormField'
import PreferencesFields from '@/components/shared/PreferencesFields'
import SalaryRangeFields from '@/components/shared/SalaryRangeFields'
import SenioritySelect from '@/components/shared/SenioritySelect'
import SkillsFieldArray from '@/components/shared/SkillsFieldArray'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import BioFormField from '@/components/shared/BioFormField'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import candidateService from '@/services/candidate.service'
import {
   CandidateProfileResponse,
   CandidateSkill,
   UpdateCandidateProfileRequest
} from '@/types/candidate.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { resourceService } from '@/services/resource.service'


const formSchema = z.object({
   fullName: z.string().min(1, 'Bắt buộc'),
   location: z.object({
      streetAddress: z.string().min(1, 'Bắt buộc'),
      ward: z.string().min(1, 'Bắt buộc'),
      provinceCity: z.string().min(1, 'Bắt buộc')
   }),
   seniority: z.enum(['INTERN', 'JUNIOR', 'SENIOR', 'LEAD']),
   salaryExpectMin: z.string(),
   salaryExpectMax: z.string(),
   currency: z.string().min(1, 'Bắt buộc'),
   remotePref: z.boolean(),
   relocationPref: z.boolean(),
   bio: z.string(),
   skills: z
      .array(
         z.object({
            skillName: z.string().min(1, 'Bắt buộc'),
            level: z.string()
         })
      )
      .min(1, 'Thêm ít nhất 1 kỹ năng')
})

export default function EditProfilePage() {
   const [saving, setSaving] = useState(false)
   const [uploadingAvatar, setUploadingAvatar] = useState(false)
   const [avatarPreview, setAvatarPreview] = useState(
      'https://www.topcv.vn/images/avatar-default.jpg'
   )
   const [defaultValues, setDefaultValues] = useState<UpdateCandidateProfileRequest | null>(null)

   const mapProfileToForm = (p: CandidateProfileResponse): UpdateCandidateProfileRequest => ({
      fullName: p.fullName,
      location: {
         streetAddress: p.location?.streetAddress || '',
         ward: p.location?.ward || '',
         provinceCity: p.location?.provinceCity || ''
      },
      seniority: p.seniority || 'JUNIOR',
      salaryExpectMin: String(p.salaryExpectMin || ''),
      salaryExpectMax: String(p.salaryExpectMax || ''),
      currency: p.currency || 'VND',
      remotePref: !!p.remotePref,
      relocationPref: !!p.relocationPref,
      bio: p.bio || '',
      skills: (p.skills || []).map((cs: CandidateSkill) => ({
         skillName: cs.skill?.name || '',
         level: String(cs.level || 1)
      }))
   })

   const form = useForm<UpdateCandidateProfileRequest>({
      resolver: zodResolver(formSchema),
      defaultValues: defaultValues || {
         remotePref: false,
         relocationPref: false,
         bio: '',
         salaryExpectMin: '',
         salaryExpectMax: ''
      }
   })

   useEffect(() => {
      let mounted = true
      ;(async () => {
         try {
            const res = await candidateService.getProfile()
            if (res?.data && mounted) {
               const p = res.data
               const formValues = mapProfileToForm(p)
               setDefaultValues(formValues)
               form.reset(formValues)
               const avatarUrl =
                  p.resource?.resourceType === 'AVATAR' ? p.resource.url : p.resource?.url
               if (avatarUrl) setAvatarPreview(avatarUrl)
            }
         } catch (err) {
            console.error('Load profile error:', err)
            showErrorToast('Không tải được hồ sơ')
         }
      })()
      return () => {
         mounted = false
      }
   }, [form])

   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         setUploadingAvatar(true)
         try {
            const reader = new FileReader()
            reader.onloadend = () => setAvatarPreview(reader.result as string)
            reader.readAsDataURL(file)

            const res = await resourceService.uploadAvatar(file)
            if (res?.code === 1000) {
               showSuccessToast('Cập nhật ảnh đại diện thành công')
            } else {
               showErrorToast(res?.message || 'Cập nhật ảnh đại diện thất bại')
            }
         } catch (err: unknown) {
            console.error('Upload avatar error:', err)
            const message =
               typeof err === 'object' && err && 'message' in err
                  ? String((err as { message?: string }).message)
                  : undefined
            showErrorToast(message || 'Có lỗi khi tải ảnh đại diện')
         } finally {
            setUploadingAvatar(false)
         }
      }
   }

   const onSubmit = async (data: UpdateCandidateProfileRequest) => {
      setSaving(true)
      try {
         const res = await candidateService.updateProfile(data)
         if (res?.code === 1000) {
            showSuccessToast('Cập nhật hồ sơ thành công')
         } else {
            showErrorToast(res?.message || 'Cập nhật hồ sơ thất bại')
         }
      } catch (err: unknown) {
         console.error('Update profile error:', err)
         const message =
            typeof err === 'object' && err && 'message' in err
               ? String((err as { message?: string }).message)
               : undefined
         showErrorToast(message || 'Có lỗi khi cập nhật hồ sơ')
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

               <FormWrapper form={form} onSubmit={onSubmit} className='space-y-6'>
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
                              className='bg-primary absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white hover:opacity-90 disabled:opacity-50'
                           >
                              <Camera size={16} />
                           </label>
                           <input
                              id='avatar-upload'
                              type='file'
                              accept='image/*'
                              className='hidden'
                              onChange={handleAvatarChange}
                              disabled={uploadingAvatar}
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
                        <FullNameFormField control={form.control} name={'fullName'} />
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
                     <BioFormField control={form.control} name={'bio'} />
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
