'use client'

import EmailFormField from '@/components/features/auth/EmailFormField'
import FullNameFormField from '@/components/features/auth/FullNameFormField'
import PasswordFormField from '@/components/features/auth/PasswordFormField'
import Button from '@/components/shared/Button'
import FormWrapper from '@/components/shared/FormWrapper'
import type { RegisterFormType } from '@/types/auth.type'
import { zodResolver } from '@hookform/resolvers/zod'
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
   const form = useForm<RegisterFormType>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         fullName: '',
         email: '',
         password: '',
         confirmPassword: ''
      }
   })

   const onSubmit = (data: RegisterFormType) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data

      console.log('=== REGISTER FORM DATA ===')
      console.log('Full Name:', registerData.fullName)
      console.log('Email:', registerData.email)
      console.log('Password:', registerData.password)
      console.log('Data to send to server:', registerData)
      console.log('========================')

   }

   return (
      <div className={`${className} w-full`}>
         <FormWrapper form={form} onSubmit={onSubmit} className='space-y-1'>
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
            <Button type='submit' variant='primary' className='w-full py-2.5'>
               Đăng ký
            </Button>
         </FormWrapper>
      </div>
   )
}
