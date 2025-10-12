import Button from '@/components/shared/Button'
import { FacebookIcon, LinkedinIcon } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Authentication - Dev Hiring Portal',
   description: 'Sign in or create an account to access the dev hiring portal'
}

export default function AuthLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <div className='flex min-h-screen w-full items-center justify-center'>
         <div className='h-fit w-[650px] space-y-4 rounded-md border p-5'>
            <div className='space-y-1.5'>
               <div className='text-primary text-xl font-semibold'>Đăng nhập</div>
               <div className='text-sm text-gray-500'>
                  Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
               </div>
            </div>
            {children}
            <div className='text-center text-sm text-gray-500'>Hoặc đăng nhập bằng</div>
            {/*  Social Login  */}
            <div className='grid grid-cols-3 gap-x-3'>
               <Button variant='primary' className='w-full !bg-[#e73b2f] py-2.5'>
                  Google
               </Button>
               <Button variant='primary' className='w-full !bg-[#1877f2] py-2.5'>
                  <FacebookIcon color='white' fill='white' size={16} />
                  Facebook
               </Button>
               <Button variant='primary' className='w-full !bg-[#0a66c2] py-2.5'>
                  <LinkedinIcon color='white' fill='white' size={16} />
                  LinkedIn
               </Button>
            </div>
            <div className='text-center text-sm'>
               Bạn chưa có tài khoản?{' '}
               <a href='/auth/register' className='text-primary'>
                  Đăng kí ngay
               </a>
            </div>
         </div>
      </div>
   )
}
