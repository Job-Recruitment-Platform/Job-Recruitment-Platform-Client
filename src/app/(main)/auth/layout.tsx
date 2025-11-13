'use client'

import Button from '@/components/shared/Button'
import { FacebookIcon, LinkedinIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AuthLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   const pathname = usePathname()
   const isLoginPage = pathname === '/auth/login'

   return (
      <div className='flex min-h-screen w-full items-center justify-center'>
         <div className='h-fit w-[650px] space-y-4 rounded-md border p-5'>
            <div className='space-y-1.5'>
               <div className='text-primary text-xl font-semibold'>
                  {isLoginPage ? 'Đăng nhập' : 'Đăng ký'}
               </div>
               <div className='text-sm text-gray-500'>
                  {isLoginPage
                     ? 'Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng'
                     : 'Tạo tài khoản để khám phá các cơ hội việc làm tốt nhất'}
               </div>
            </div>

            {/*  Show Form Here  */}
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
               {isLoginPage ? (
                  <>
                     Bạn chưa có tài khoản?{' '}
                     <Link href='/auth/register' className='text-primary hover:underline'>
                        Đăng ký ngay
                     </Link>
                  </>
               ) : (
                  <>
                     Bạn đã có tài khoản?{' '}
                     <Link href='/auth/login' className='text-primary hover:underline'>
                        Đăng nhập ngay
                     </Link>
                  </>
               )}
            </div>
         </div>
      </div>
   )
}
