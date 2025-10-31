'use client'

import Button from '@/components/shared/Button'
import UserInfo from '@/components/shared/user-profile/UserInfo'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/hooks/useAuth'
import { Building2, LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

type UserProfileDialogProps = {
   children?: React.ReactNode
}

export default function UserProfilePopover({ children }: UserProfileDialogProps) {
   const [open, setOpen] = useState(false)
   const { logout } = useAuth()

   const handleLogout = async () => {
      try {
         await logout()
         setOpen(false)
      } catch (error) {
         console.error('Logout failed:', error)
      }
   }

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger
            asChild
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
         >
            <div>{children}</div>
         </PopoverTrigger>
         <PopoverContent
            side='bottom'
            align='end'
            sideOffset={8}
            className='w-[400px] border-none p-0 shadow-md'
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
         >
            <UserInfo />

            <div className='border-t py-2'>
               <Link
                  href='/profile'
                  className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50'
                  onClick={() => setOpen(false)}
               >
                  <User size={16} />
                  Hồ sơ của tôi
               </Link>
               <Link
                  href='/profile/edit'
                  className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50'
                  onClick={() => setOpen(false)}
               >
                  <Settings size={16} />
                  Chỉnh sửa hồ sơ
               </Link>
               <Link
                  href='/recruiter/dashboard'
                  className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50'
                  onClick={() => setOpen(false)}
               >
                  <Building2 size={16} />
                  Khu vực nhà tuyển dụng
               </Link>
               <Link
                  href='/recruiter/settings/company'
                  className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50'
                  onClick={() => setOpen(false)}
               >
                  <Settings size={16} />
                  Cài đặt công ty
               </Link>
            </div>

            <div className='border-t p-3'>
               <Button
                  variant='outline'
                  className='flex w-full items-center justify-center gap-2 rounded-full !border-none bg-red-50 py-2 text-red-600 hover:bg-red-100'
                  onClick={handleLogout}
               >
                  <LogOut size={16} />
                  Đăng xuất
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   )
}
