'use client'

import Button from '@/components/shared/Button'
import SavedJobButton from '@/components/shared/SavedJobButton'
import UserProfile from '@/components/shared/user-profile/UserProfile'
import { useAuth } from '@/hooks/useAuth'
import { BellRingIcon, ChevronsRight, MessageCircleMoreIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
   const { isLogin } = useAuth()
   const router = useRouter()

   return (
      <header className='flex items-center justify-between gap-x-3 bg-white px-5 py-4'>
         <div className='space-x-3'>
            <span>Việc làm</span>
            <span>Cẩm nang nghề nghiệp</span>
         </div>
         <div className='flex space-x-3'>
            {isLogin ? (
               <div className='flex items-center gap-x-4'>
                  <Button variant='ghost' className='rounded-full !p-3'>
                     <BellRingIcon size={18} />
                  </Button>
                  <Button variant='ghost' className='rounded-full !p-3'>
                     <MessageCircleMoreIcon size={18} />
                  </Button>

                  <UserProfile />

                  <div className='space-y-1 border-l pl-4 text-start'>
                     <div className='text-xs text-gray-400'>Bạn là nhà tuyển dụng</div>
                     <button className='hover:text-primary flex items-center gap-x-1 text-sm font-semibold'>
                        <span>Đăng tuyển ngay</span> <ChevronsRight size={16} />
                     </button>
                  </div>
               </div>
            ) : (
               <>
                  <Button
                     variant='outline'
                     className='rounded-full px-5 py-2'
                     onClick={() => router.push('/auth/register')}
                  >
                     Đăng ký
                  </Button>
                  <Button
                     variant='primary'
                     className='rounded-full px-5 py-2'
                     onClick={() => router.push('/auth/login')}
                  >
                     Đăng nhập
                  </Button>
                  <Button variant='ghost' className='rounded-full px-5 py-2'>
                     Đăng tuyển và tìm hồ sơ
                  </Button>
               </>
            )}
         </div>
      </header>
   )
}
