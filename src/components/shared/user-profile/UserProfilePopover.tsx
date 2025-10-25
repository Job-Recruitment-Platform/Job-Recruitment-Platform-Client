'use client'

import Button from '@/components/shared/Button'
import UserInfo from '@/components/shared/user-profile/UserInfo'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

type UserProfileDialogProps = {
   children?: React.ReactNode
}

export default function UserProfilePopover({ children }: UserProfileDialogProps) {
   const [open, setOpen] = useState(false)
   const { logout } = useAuth()

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
            <div className='w-full p-3.5'>
               <Button
                  variant='outline'
                  className='w-full rounded-full !border-none bg-gray-300 py-2'
                  onClick={() => logout()}
               >
                  Đăng xuất
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   )
}
