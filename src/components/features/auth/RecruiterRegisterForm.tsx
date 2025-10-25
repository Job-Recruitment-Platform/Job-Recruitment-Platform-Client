'use client'

import Button from '@/components/shared/Button'
import CompanyFormField from '@/components/shared/CompanyFormField'
import EmailFormField from '@/components/shared/EmailFormField'
import FormWrapper from '@/components/shared/FormWrapper'
import FullNameFormField from '@/components/shared/FullNameFormField'
import PasswordFormField from '@/components/shared/PasswordFormField'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@radix-ui/react-checkbox'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const recruiterRegisterSchema = z
   .object({
      email: z
         .string()
         .min(1, { message: 'Email là bắt buộc' })
         .email({ message: 'Email không hợp lệ' }),
      password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
      confirmPassword: z.string().min(6, { message: 'Nhập lại mật khẩu phải có ít nhất 6 ký tự' }),
      fullName: z.string().min(1, { message: 'Họ và tên là bắt buộc' }),
      companyName: z.string().min(1, { message: 'Tên công ty là bắt buộc' })
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu không trùng khớp',
      path: ['confirmPassword']
   })

type RecruiterRegisterFormData = z.infer<typeof recruiterRegisterSchema>

type RecruiterRegisterFormProps = {
   className?: string
}

export default function RecruiterRegisterForm({ className }: RecruiterRegisterFormProps) {
   const [isLoading, setIsLoading] = useState(false)
   const [agreeTerms, setAgreeTerms] = useState(false)

   const form = useForm<RecruiterRegisterFormData>({
      resolver: zodResolver(recruiterRegisterSchema),
      defaultValues: {
         email: '',
         password: '',
         fullName: '',
         companyName: ''
      }
   })

   const onSubmit = async (data: RecruiterRegisterFormData) => {
      if (!agreeTerms) {
         showErrorToast('Vui lòng đồng ý với Điều khoản dịch vụ')
         return
      }

      try {
         setIsLoading(true)

         console.log('📋 Recruiter Register Data:', {
            ...data,
            agreeTerms
         })

         showSuccessToast('Đăng ký thành công! Đang chuyển hướng...')

         // TODO: Gọi API để register recruiter
         // const response = await authService.registerRecruiter(data)
         // setIsLogin(true)
         // router.push('/')

         // Mô phỏng delay
         setTimeout(() => {
            form.reset()
            setAgreeTerms(false)
         }, 1500)
      } catch (error) {
         if (error instanceof Error) {
            showErrorToast(error.message)
         } else {
            showErrorToast('Đăng ký thất bại. Vui lòng thử lại!')
         }
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className={`${className} w-full space-y-4`}>
         <FormWrapper form={form} onSubmit={onSubmit} className='space-y-3'>
            {/* Email input field */}
            <EmailFormField control={form.control} name='email' placeholder='Email' />

            {/* Password input field */}
            <PasswordFormField
               control={form.control}
               name='password'
               placeholder='Nhập mật khẩu (từ 6 ký tự)'
            />

            {/* Confirm Password input field */}
            <PasswordFormField
               control={form.control}
               name='confirmPassword'
               label='Nhập lại mật khẩu'
               placeholder='Nhập lại mật khẩu'
            />

            {/* Recruiter Info Section */}
            <div className='space-y-3 border-t pt-4'>
               <h3 className='t font-semibold text-gray-800'>Thông tin nhà tuyển dụng</h3>

               {/* Full Name input field */}
               <FullNameFormField control={form.control} name='fullName' />

               {/* Company Name input field */}
               <CompanyFormField control={form.control} name='companyName' />
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className='flex items-start space-x-2'>
               <Checkbox
                  id='terms'
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className='mt-1'
               />
               <label htmlFor='terms' className='cursor-pointer text-sm leading-5 text-gray-600'>
                  Tôi đã đọc và đồng ý với{' '}
                  <a href='#' className='text-primary hover:underline'>
                     Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href='#' className='text-primary hover:underline'>
                     Chính sách bảo mật
                  </a>{' '}
                  của TopCV.
               </label>
            </div>

            {/* Register submit button */}
            <Button type='submit' variant='primary' className='w-full py-2.5' disabled={isLoading}>
               {isLoading ? 'Đang đăng ký...' : 'Hoàn tất'}
            </Button>
         </FormWrapper>
      </div>
   )
}
