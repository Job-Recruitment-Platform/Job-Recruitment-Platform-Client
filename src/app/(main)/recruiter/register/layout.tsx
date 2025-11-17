'use client'

import Link from 'next/link'

export default function RecruiterRegisterLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <div className='flex min-h-screen w-full items-center justify-center'>
         <div className='h-fit w-[650px] space-y-4 rounded-md border p-5'>
            <div className='space-y-1.5'>
               <div className='text-primary text-xl font-semibold'>Đăng ký tài khoản nhà tuyển dụng</div>
            </div>

            {children}

            <div className='text-center text-sm'>
               Đã có tài khoản?{' '}
               <Link href='/auth/login' className='text-primary hover:underline'>
                  Đăng nhập ngay
               </Link>
            </div>
         </div>
      </div>
   )
}


