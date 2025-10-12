import Button from '@/components/shared/Button'

export default function Header() {
   return (
      <header className='flex items-center bg-white justify-between gap-x-3 px-2 py-5'>
         <div className='space-x-3'>
            <span>Việc làm</span>
            <span>Cẩm nang nghề nghiệp</span>
         </div>
         <div className='flex space-x-3'>
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
