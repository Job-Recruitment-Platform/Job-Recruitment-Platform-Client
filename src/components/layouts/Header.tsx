'use client'

import Button from '@/components/shared/Button'
import UserProfile from '@/components/shared/user-profile/UserProfile'
import { useAuth } from '@/hooks/useAuth'
import { BellRingIcon, Briefcase, ChevronsRight, MessageCircleMoreIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
   const { isLogin } = useAuth()
   const router = useRouter()
   const pathname = usePathname()

   const navLinks = [
      { href: '/', label: 'Trang chủ' },
      { href: '/search', label: 'Việc làm' },
      { href: '#', label: 'Cẩm nang nghề nghiệp' }
   ]
   const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))

   return (
      <header className='border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70'>
         <div className='container mx-auto flex items-center justify-between gap-4 px-5 py-3'>
            <div className='flex min-w-0 items-center gap-6'>
               <Link
                  href='/'
                  className='text-primary flex items-center gap-2 rounded-md px-2 py-1 hover:opacity-90'
               >
                  <span className='bg-primary/10 flex h-7 w-7 items-center justify-center rounded-md'>
                     <Briefcase size={16} />
                  </span>
                  <span className='text-base font-semibold'>BotCV</span>
               </Link>
               <nav className='hidden items-center gap-1 md:flex'>
                  {navLinks.map((link) => (
                     <Link
                        key={link.href}
                        href={link.href}
                        className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                           isActive(link.href)
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                     >
                        {link.label}
                     </Link>
                  ))}
               </nav>
            </div>
            <div className='flex items-center gap-x-3'>
               {isLogin ? (
                  <div className='flex items-center gap-x-4'>
                     <Button variant='ghost' className='rounded-full !p-3'>
                        <BellRingIcon size={18} />
                     </Button>
                     <Button variant='ghost' className='rounded-full !p-3'>
                        <MessageCircleMoreIcon size={18} />
                     </Button>

                     <UserProfile />

                     <div className='space-y-1 border-l pl-4 text-start'>
                        <div className='text-xs text-gray-400'>Bạn là nhà tuyển dụng</div>
                        <button
                           className='hover:text-primary flex items-center gap-x-1 text-sm font-semibold'
                           onClick={() => router.push('/job/save')}
                        >
                           <span>Đăng tuyển ngay</span> <ChevronsRight size={16} />
                        </button>
                     </div>
                  </div>
               ) : (
                  <>
                     <Button
                        variant='outline'
                        className='rounded-full px-5 py-2'
                        onClick={() => router.push('/auth/register')}
                     >
                        Đăng ký
                     </Button>
                     <Button
                        variant='primary'
                        className='rounded-full px-5 py-2'
                        onClick={() => router.push('/auth/login')}
                     >
                        Đăng nhập
                     </Button>
                     <Button
                        variant='ghost'
                        className='rounded-full px-5 py-2'
                        onClick={() => router.push('/recruiter/register')}
                     >
                        Đăng tuyển và tìm hồ sơ
                     </Button>
                  </>
               )}
            </div>
         </div>
      </header>
   )
}
