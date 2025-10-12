'use client'

import EmailFormField from '@/components/features/auth/EmailFormField'
import PasswordFormField from '@/components/features/auth/PasswordFormField'
import Button from '@/components/shared/Button'
import FormWrapper from '@/components/shared/FormWrapper'
import type { LoginType } from '@/types/auth.type'
import { zodResolver } from '@hookform/resolvers/zod'
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
   const form = useForm<LoginType>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: '',
         password: ''
      }
   })

   const onSubmit = (data: LoginType) => {
      console.log('=== LOGIN FORM DATA ===')
      console.log('Email:', data.email)
      console.log('Password:', data.password)
      console.log('Full data:', data)
      console.log('=====================')
   }

   return (
      <div className={`${className} w-full`}>
         <FormWrapper form={form} onSubmit={onSubmit} className='space-y-1'>
            {/* Email Field */}
            <EmailFormField control={form.control} name='email' placeholder='Nhập email' />

            {/* Password Field */}
            <PasswordFormField control={form.control} name='password' placeholder='Nhập mật khẩu' />

            {/* Submit Button */}
            <Button type='submit' variant='primary' className='w-full py-2.5'>
               Đăng nhập
            </Button>
         </FormWrapper>
      </div>
   )
}
