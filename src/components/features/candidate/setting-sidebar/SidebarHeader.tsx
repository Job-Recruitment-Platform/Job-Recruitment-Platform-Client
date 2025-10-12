import Button from '@/components/shared/Button'
import { CameraIcon } from 'lucide-react'

type SidebarHeaderProps = {
   className?: string
}

export default function SidebarHeader({ className }: SidebarHeaderProps) {
   return (
      <div className={`flex w-full items-start ${className}`}>
         {/*  Avatar  */}
         <div className='relative h-[83px] w-[83px] border'>
            <Button variant='primary' className='absolute right-0 bottom-0 rounded-full !p-1'>
               <CameraIcon color='white' size={13} />
            </Button>
         </div>

         {/*  Info  */}
         <div className='flex-1 space-y-0.5 pb-5 pl-5'>
            <div className='text-sm'>Chào mừng bạn trở lại</div>
            <div className='font-semibold'>Nguyen Van A</div>
            <div className='w-fit bg-gray-400 px-1.5 py-1 text-xs font-medium text-white'>
               Tài khoản đã xác thực
            </div>
            <div className='text-xs'>Nâng cấp tài khoản</div>
         </div>
      </div>
   )
}
