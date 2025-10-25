import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function UserInfo() {
   return (
      <div className='flex w-full items-center border-b p-3.5'>
         <div className='mr-2.5 h-[70px] w-[70px]'>
            <Avatar className='h-full w-full'>
               <AvatarImage src='https://github.com/shadcn.png' />
               <AvatarFallback>CN</AvatarFallback>
            </Avatar>
         </div>
         <div className='space-y-2 text-sm'>
            <div className='text-[15px] font-semibold'>Nguyen Van A</div>
            <div>Tài khoản đã xác thực</div>
            <div className='line-clamp-1'>
               <span className='pr-2'>ID 123456789</span>
               <span className='border-l pl-2'>test@gmail.com</span>
            </div>
         </div>
      </div>
   )
}
