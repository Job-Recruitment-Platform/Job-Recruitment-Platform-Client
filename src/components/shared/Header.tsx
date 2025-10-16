import Button from '@/components/shared/Button'
import UserProfile from '@/components/shared/user-profile/UserProfile'

export default function Header() {
   return (
      <header className='flex items-center justify-between gap-x-3 bg-white px-2 py-5'>
         <div className='space-x-3'>
            <span>Việc làm</span>
            <span>Cẩm nang nghề nghiệp</span>
         </div>
         <div className='flex space-x-3'>
            <UserProfile />
            <Button variant='outline' className='rounded-full px-5 py-2'>
               Đăng ký
            </Button>
            <Button variant='primary' className='rounded-full px-5 py-2'>
               Đăng nhập
            </Button>
         </div>
      </header>
   )
}
