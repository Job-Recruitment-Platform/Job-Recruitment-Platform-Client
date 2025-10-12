'use client'

import EmailFormField from '@/components/features/auth/EmailFormField'
import PasswordFormField from '@/components/features/auth/PasswordFormField'
import Button from '@/components/shared/Button'
import FormWrapper from '@/components/shared/FormWrapper'
import { useAuth } from '@/contexts/AuthContext'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import type { LoginType } from '@/types/auth.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
   email: z
      .string()
      .min(1, { message: 'Email là bắt buộc' })
      .email({ message: 'Email không hợp lệ' }),
   password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
})

type LoginFormProps = {
   className?: string
}

export default function LoginForm({ className }: LoginFormProps) {
   const router = useRouter()
   const { login: authLogin } = useAuth()
   const [isLoading, setIsLoading] = useState(false)

   const form = useForm<LoginType>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: '',
         password: ''
      }
   })

   const onSubmit = async (data: LoginType) => {
      try {
         setIsLoading(true)

         await authLogin(data)

         showSuccessToast('Đăng nhập thành công!')

         // Reset form
         form.reset()

         // Redirect to home after 1.5 seconds
         setTimeout(() => {
            router.push('/home')
         }, 1500)
      } catch (error) {
         if (error instanceof Error) {
            showErrorToast(error.message)
         } else {
            showErrorToast('Đăng nhập thất bại. Vui lòng thử lại!')
         }
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className={`${className} w-full`}>
         <FormWrapper form={form} onSubmit={onSubmit} className='space-y-1'>
            {/* Email Field */}
            <EmailFormField control={form.control} name='email' placeholder='Nhập email' />

            {/* Password Field */}
            <PasswordFormField control={form.control} name='password' placeholder='Nhập mật khẩu' />

            {/* Submit Button */}
            <Button type='submit' variant='primary' className='w-full py-2.5' disabled={isLoading}>
               {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
         </FormWrapper>
      </div>
   )
}
