import UserProfileDialog from '@/components/shared/user-profile/UserProfilePopover'
import { ChevronDownIcon } from 'lucide-react'
import Image from 'next/image'

export default function UserProfile() {
   return (
      <UserProfileDialog>
         <button className='group relative h-[40px] w-[40px] cursor-pointer transition-transform hover:scale-105'>
            <Image
               src='https://www.topcv.vn/images/avatar-default.jpg'
               width={40}
               height={40}
               alt='User avatar'
               className='rounded-full ring-2 ring-transparent transition-all group-hover:ring-primary/20'
            />
            <div className='absolute right-0 bottom-0 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-gray-200'>
               <ChevronDownIcon size={12} className='text-gray-600' />
            </div>
         </button>
      </UserProfileDialog>
   )
}
