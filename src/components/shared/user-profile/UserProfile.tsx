import UserProfileDialog from '@/components/shared/user-profile/UserProfilePopover'
import { ChevronDownIcon } from 'lucide-react'
import Image from 'next/image'

export default function UserProfile() {
   return (
      <UserProfileDialog>
         <div className='relative h-[40px] w-[40px]'>
            <Image
               src='https://www.topcv.vn/images/avatar-default.jpg'
               width={40}
               height={40}
               alt=''
               className='rounded-full'
            />
            <div className='absolute right-0 bottom-0 rounded-full bg-gray-200 p-0.5'>
               <ChevronDownIcon size={12} />
            </div>
         </div>
      </UserProfileDialog>
   )
}
