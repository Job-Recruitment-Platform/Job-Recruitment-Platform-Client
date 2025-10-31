'use client'

import Button from '@/components/shared/Button'
import EmailFormField from '@/components/shared/EmailFormField'
import FormWrapper from '@/components/shared/FormWrapper'
import PasswordFormField from '@/components/shared/PasswordFormField'
import { useAuth } from '@/hooks/useAuth'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import type { LoginRequest, TokenPayload } from '@/types/auth.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { jwtDecode } from 'jwt-decode'


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

   const form = useForm<LoginRequest>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: '',
         password: ''
      }
   })

   const onSubmit = async (data: LoginRequest) => {
      try {
         setIsLoading(true)

         await authLogin(data)

         showSuccessToast('Đăng nhập thành công!')

         // Clear form after successful login
         form.reset()

         const decoded: TokenPayload = jwtDecode<
         { iss: string, sub: string, role: string, exp: number, iat: number, tokenType: string }>
         (localStorage.getItem('accessToken') || '')

         // Redirect to home after 1.5 seconds
         if (decoded.role === 'RECRUITER') {
            router.push('/recruiter/dashboard')
         } else {
            router.push('/')
         }
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
            {/* Email input field */}
            <EmailFormField control={form.control} name='email' placeholder='Nhập email' />

            {/* Password input field */}
            <PasswordFormField control={form.control} name='password' placeholder='Nhập mật khẩu' />

            {/* Login submit button */}
            <Button type='submit' variant='primary' className='w-full py-2.5' disabled={isLoading}>
               {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
         </FormWrapper>
      </div>
   )
}
