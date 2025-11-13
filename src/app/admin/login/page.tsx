'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Button from '@/components/shared/Button'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { authService } from '@/services/auth.service'
import { LogoutRequest, TokenPayload } from '@/types/auth.type'
import { jwtDecode } from 'jwt-decode'

const loginSchema = z.object({
   email: z.email('Email không hợp lệ'),
   password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự')
})

type LoginForm = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
   const router = useRouter()
   const [showPassword, setShowPassword] = useState(false)
   const [loading, setLoading] = useState(false)

   const {
      register,
      handleSubmit,
      formState: { errors }
   } = useForm<LoginForm>({
      resolver: zodResolver(loginSchema)
   })

   const onSubmit = async (data: LoginForm) => {
      setLoading(true)
      try {
         const response = await authService.login(data)
         const decoded: TokenPayload = jwtDecode<{
            iss: string
            sub: string
            role: string
            exp: number
            iat: number
            tokenType: string
         }>(localStorage.getItem('accessToken') || '')
         if (decoded.role !== 'ADMIN') {
            const logoutRequest: LogoutRequest = {
               refreshToken: response.data.refreshToken
            }
            authService.logout(logoutRequest)
            throw new Error('Không có quyền truy cập')
         }

         showSuccessToast('Đăng nhập thành công')
         router.push('/admin/dashboard')
      } catch (error: any) {
         showErrorToast(error.message || 'Đăng nhập thất bại')
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className='from-primary/5 to-primary/10 flex min-h-screen items-center justify-center bg-gradient-to-br'>
         <div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg'>
            {/* Header */}
            <div className='text-center'>
               <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                  <Shield className='text-primary h-8 w-8' />
               </div>
               <h1 className='text-2xl font-bold text-gray-900'>Administrator</h1>
               <p className='mt-2 text-sm text-gray-600'>Đăng nhập vào trang của quản trị viên</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
               <div>
                  <div className='block text-sm font-medium text-gray-700'>Email</div>
                  <Input
                     {...register('email')}
                     type='email'
                     className='mt-1'
                  />
                  {errors.email && (
                     <p className='mt-1 text-xs text-red-500'>{errors.email.message}</p>
                  )}
               </div>

               <div>
                  <div className='block text-sm font-medium text-gray-700'>Mật khẩu</div>
                  <div className='relative mt-1'>
                     <Input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                     />
                     <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                     >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
                  {errors.password && (
                     <p className='mt-1 text-xs text-red-500'>{errors.password.message}</p>
                  )}
               </div>

               <Button type='submit' variant='primary' className='w-full' disabled={loading}>
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
               </Button>
            </form>
         </div>
      </div>
   )
}
