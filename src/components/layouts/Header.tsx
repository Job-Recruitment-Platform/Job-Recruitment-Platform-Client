'use client'

import Button from '@/components/shared/Button'
import SavedJobButton from '@/components/shared/SavedJobButton'
import UserProfile from '@/components/shared/user-profile/UserProfile'
import { useAuth } from '@/hooks/useAuth'
import { BellRingIcon, ChevronsRight, MessageCircleMoreIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Briefcase } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { recruiterService } from '@/services/recruiter.service'
import candidateService from '@/services/candidate.service'

export default function Header() {
   const { isLogin } = useAuth()
   const router = useRouter()
   const pathname = usePathname()

   const userRole = (() => {
      try {
         const decoded: { role: string } = jwtDecode(localStorage.getItem('accessToken') || '')
         return decoded.role
      } catch {
         return null
      }
   })()

   const isRecruiter = userRole === 'RECRUITER'

   // Fetch user profile for avatar
   const { data: recruiterData } = useQuery({
      queryKey: ['recruiter-profile'],
      queryFn: () => recruiterService.getProfile(),
      enabled: isLogin && isRecruiter,
      staleTime: 5 * 60 * 1000
   })

   const { data: candidateData } = useQuery({
      queryKey: ['candidate-profile'],
      queryFn: () => candidateService.getProfile(),
      enabled: isLogin && !isRecruiter,
      staleTime: 5 * 60 * 1000
   })

   const userData = isRecruiter ? recruiterData?.data : candidateData?.data

   const navLinks = [
      { href: '/', label: 'Trang chủ' },
      { href: '/search', label: 'Việc làm' },
      { href: '#', label: 'Cẩm nang nghề nghiệp' }
   ]
   const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))

   return (
      <header className='bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b'>
         <div className='container mx-auto flex items-center justify-between gap-4 px-5 py-3'>
            <div className='flex min-w-0 items-center gap-6'>
               <Link href='/' className='flex items-center gap-2 rounded-md px-2 py-1 text-primary hover:opacity-90'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-md bg-primary/10'>
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

                  <UserProfile 
                     avatarUrl={userData?.resource?.url}
                     fullName={userData?.fullName}
                  />

                  <div className='space-y-1 border-l pl-4 text-start'>
                     <div className='text-xs text-gray-400'>Bạn là nhà tuyển dụng</div>
                     <button
                        className='hover:text-primary flex items-center gap-x-1 text-sm font-semibold'
                        onClick={() => { 
                           if (userRole === 'RECRUITER') { 
                              router.push('/recruiter/dashboard')
                           }
                           else if (userRole === 'CANDIDATE') {
                              router.push('/recruiter/register')
                           }
                        }}
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
                  <Button variant='ghost'
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
