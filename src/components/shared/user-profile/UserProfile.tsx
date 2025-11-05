import UserProfileDialog from '@/components/shared/user-profile/UserProfilePopover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronDownIcon } from 'lucide-react'

interface UserProfileProps {
   avatarUrl?: string
   fullName?: string
}

export default function UserProfile({ avatarUrl, fullName }: UserProfileProps) {
   const initials = fullName
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

   return (
      <UserProfileDialog>
         <button className='group relative h-[40px] w-[40px] cursor-pointer transition-transform hover:scale-105'>
            <Avatar className='h-full w-full ring-2 ring-transparent transition-all group-hover:ring-primary/20'>
               <AvatarImage 
                  src={avatarUrl || 'https://www.topcv.vn/images/avatar-default.jpg'} 
                  className='object-cover'
               />
               <AvatarFallback className='bg-primary/10 text-primary text-sm font-semibold'>
                  {initials}
               </AvatarFallback>
            </Avatar>
            <div className='absolute right-0 bottom-0 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-gray-200'>
               <ChevronDownIcon size={12} className='text-gray-600' />
            </div>
         </button>
      </UserProfileDialog>
   )
}
