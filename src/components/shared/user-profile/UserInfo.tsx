import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BadgeCheck } from 'lucide-react'

export default function UserInfo() {
   return (
      <div className='flex w-full items-center gap-3 border-b p-4'>
         <div className='h-[70px] w-[70px] shrink-0'>
            <Avatar className='h-full w-full'>
               <AvatarImage src='https://www.topcv.vn/images/avatar-default.jpg' />
               <AvatarFallback className='bg-primary/10 text-primary text-lg font-semibold'>NV</AvatarFallback>
            </Avatar>
         </div>
         <div className='min-w-0 flex-1 space-y-1.5'>
            <div className='flex items-center gap-1.5'>
               <div className='text-[15px] font-semibold'>Nguyễn Văn A</div>
               <BadgeCheck size={16} className='shrink-0 text-blue-500' />
            </div>
            <div className='flex items-center gap-1.5 text-xs text-gray-500'>
               <span className='rounded bg-green-100 px-1.5 py-0.5 text-green-700'>Đã xác thực</span>
            </div>
            <div className='flex items-center gap-2 text-xs text-gray-600'>
               <span>ID: 123456789</span>
               <span className='text-gray-400'>•</span>
               <span className='truncate'>nguyenvana@email.com</span>
            </div>
         </div>
      </div>
   )
}
