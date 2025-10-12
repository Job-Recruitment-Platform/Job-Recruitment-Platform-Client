'use client'

import Button from '@/components/shared/Button'
import EmailFormField from '@/components/shared/EmailFormField'
import FormWrapper from '@/components/shared/FormWrapper'
import FullNameFormField from '@/components/shared/FullNameFormField'
import PhoneFormField from '@/components/shared/PhoneFormField'
import { CandidateProfileFormType } from '@/types/candidate.type'
import { useForm } from 'react-hook-form'

export default function CandidateProfile() {
   const form = useForm<CandidateProfileFormType>({
      defaultValues: {
         fullName: '',
         email: '',
         phone: ''
      }
   })

   const handleSubmit = (data: CandidateProfileFormType) => {
      console.log('=== CANDIDATE PROFILE INFO ===')
      console.log('Full Name:', data.fullName)
      console.log('Email:', data.email)
      console.log('Phone:', data.phone)
      console.log('Full Data:', data)
      console.log('==============================')
   }

   return (
      <div className='w-full rounded-lg space-y-2 bg-white p-6'>
         <div>
            <h4 className=''>Cài đặt thông tin cá nhân</h4>
            <div>
               <span>(*)</span>
               <span>Các thông tin bắt buộc</span>
            </div>
         </div>

         <FormWrapper form={form} onSubmit={handleSubmit} className='space-y-2'>
            <FullNameFormField
               control={form.control}
               name='fullName'
               placeholder='Nhập họ và tên'
            />
            <EmailFormField control={form.control} name='email' placeholder='Nhập email' />
            <PhoneFormField control={form.control} name='phone' placeholder='Nhập số điện thoại' />

            {/* Submit Button */}
            <Button type='submit' variant='primary' className='w-fit py-2.5 px-10 rounded-sm'>
               Lưu
            </Button>
         </FormWrapper>
      </div>
   )
}
