'use client'

import EmailFormField from '@/components/features/auth/EmailFormField'
import FullNameFormField from '@/components/features/auth/FullNameFormField'
import PasswordFormField from '@/components/features/auth/PasswordFormField'
import Button from '@/components/shared/Button'
import FormWrapper from '@/components/shared/FormWrapper'
import { ApiError } from '@/lib/axios'
import { authService } from '@/services/auth.service'
import type { RegisterFormType } from '@/types/auth.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const registerSchema = z
   .object({
      fullName: z
         .string()
         .min(1, { message: 'Họ và tên là bắt buộc' })
         .min(3, { message: 'Họ và tên phải có ít nhất 3 ký tự' }),
      email: z
         .string()
         .min(1, { message: 'Email là bắt buộc' })
         .email({ message: 'Email không hợp lệ' }),
      password: z
         .string()
         .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
         .regex(/[A-Z]/, { message: 'Mật khẩu phải có ít nhất 1 chữ hoa' })
         .regex(/[a-z]/, { message: 'Mật khẩu phải có ít nhất 1 chữ thường' })
         .regex(/[0-9]/, { message: 'Mật khẩu phải có ít nhất 1 số' }),
      confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' })
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword']
   })

type RegisterFormProps = {
   className?: string
}

export default function RegisterForm({ className }: RegisterFormProps) {
   const router = useRouter()
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const form = useForm<RegisterFormType>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         fullName: '',
         email: '',
         password: '',
         confirmPassword: ''
      }
   })

   const onSubmit = async (data: RegisterFormType) => {
      try {
         setIsLoading(true)
         setError(null)

         // Loại bỏ confirmPassword trước khi gửi lên server
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { confirmPassword, ...registerData } = data

         console.log('🚀 Sending register request...')
         console.log('Data:', registerData)

         // Call API register
         const response = await authService.registerCandidate(registerData)

         console.log('✅ Register success!')
         console.log('Response:', response)

         // Hiển thị thông báo thành công
         alert(
            `${response.message}\n\nEmail: ${response.data.email}\nRole: ${response.data.roleName}\nStatus: ${response.data.status}`
         )

         // Reset form
         form.reset()

         // Redirect về trang login sau 1s
         setTimeout(() => {
            router.push('/auth/login')
         }, 1000)
      } catch (err) {
         console.error('❌ Register failed!')
         console.error('Error:', err)

         // Handle error
         if (err instanceof ApiError) {
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.')
         } else if (err instanceof Error) {
            setError(err.message)
         } else {
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
         }
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className={`${className} w-full`}>
         <FormWrapper form={form} onSubmit={onSubmit} className='space-y-1'>
            {/* Error Alert */}
            {error && (
               <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600'>
                  <strong>Lỗi:</strong> {error}
               </div>
            )}

            {/* Full Name Field */}
            <FullNameFormField
               control={form.control}
               name='fullName'
               placeholder='Nhập họ và tên'
            />

            {/* Email Field */}
            <EmailFormField control={form.control} name='email' placeholder='Nhập email' />

            {/* Password Field */}
            <PasswordFormField control={form.control} name='password' placeholder='Nhập mật khẩu' />

            {/* Confirm Password Field */}
            <PasswordFormField
               control={form.control}
               name='confirmPassword'
               label='Xác nhận mật khẩu'
               placeholder='Nhập lại mật khẩu'
            />

            {/* Submit Button */}
            <Button type='submit' variant='primary' className='w-full py-2.5' disabled={isLoading}>
               {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
         </FormWrapper>
      </div>
   )
}
