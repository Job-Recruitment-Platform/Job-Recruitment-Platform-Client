'use client'

import Button from '@/components/shared/Button'
import UserInfo from '@/components/shared/user-profile/UserInfo'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import { Building2, LogOut, Settings, User, Loader2 } from 'lucide-react'
import { useRouter } from 'next/dist/client/components/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { recruiterService } from '@/services/recruiter.service'
import candidateService from '@/services/candidate.service'

type UserProfileDialogProps = {
   children?: React.ReactNode
}

export default function UserProfilePopover({ children }: UserProfileDialogProps) {
   const [open, setOpen] = useState(false)
   const { logout } = useAuth()
   const router = useRouter()

   const isRecruiter = (() => {
      try {
         const decoded: { role: string } = jwtDecode(localStorage.getItem('accessToken') || '')
         return decoded.role === 'RECRUITER'
      } catch {
         return false
      }
   })()

   // Fetch user profile based on role
   const { data: recruiterData, isLoading: recruiterLoading } = useQuery({
      queryKey: ['recruiter-profile'],
      queryFn: () => recruiterService.getProfile(),
      enabled: isRecruiter && open,
      staleTime: 5 * 60 * 1000 // 5 minutes
   })

   const { data: candidateData, isLoading: candidateLoading } = useQuery({
      queryKey: ['candidate-profile'],
      queryFn: () => candidateService.getProfile(),
      enabled: !isRecruiter && open,
      staleTime: 5 * 60 * 1000 // 5 minutes
   })

   const isLoading = isRecruiter ? recruiterLoading : candidateLoading
   const userData = isRecruiter ? recruiterData?.data : candidateData?.data

   const handleLogout = async () => {
      try {
         await logout()
         setOpen(false)
         router.push('/')
      } catch (error) {
         console.error('Logout failed:', error)
      }
   }

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger
            asChild
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
         >
            <div>{children}</div>
         </PopoverTrigger>
         <PopoverContent
            side='bottom'
            align='end'
            sideOffset={8}
            className='w-[400px] border-none p-0 shadow-md'
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
         >
            {isLoading ? (
               <div className='flex items-center justify-center border-b p-8'>
                  <Loader2 className='h-6 w-6 animate-spin text-primary' />
               </div>
            ) : userData ? (
               <UserInfo
                  avatarUrl={userData.resource?.url}
                  fullName={userData.fullName || 'User'}
                  email={userData.email || 'N/A'}
                  userId={userData.id}
                  isVerified={true}
               />
            ) : (
               <div className='border-b p-4 text-center text-sm text-gray-500'>
                  Không thể tải thông tin người dùng
               </div>
            )}

            <div className='border-t py-2'>
               {!isRecruiter && (
                  <>
                     <Link
                        href='/profile/edit'
                        className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50'
                        onClick={() => setOpen(false)}
                     >
                        <User size={16} />
                        Hồ sơ của tôi
                     </Link>
                     <Link
                        href='/profile/edit'
                        className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50'
                        onClick={() => setOpen(false)}
                     >
                        <Settings size={16} />
                        Chỉnh sửa hồ sơ
                     </Link>
                  </>
               )}
               {isRecruiter && (
                  <>
                     <Link
                        href='/recruiter/dashboard'
                        className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50'
                        onClick={() => setOpen(false)}
                     >
                        <Building2 size={16} />
                        Khu vực nhà tuyển dụng
                     </Link>
                     <Link
                        href='/recruiter/settings/profile'
                        className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50'
                        onClick={() => setOpen(false)}
                     >
                        <User size={16} />
                        Hồ sơ cá nhân
                     </Link>
                     <Link
                        href='/recruiter/settings/company'
                        className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50'
                        onClick={() => setOpen(false)}
                     >
                        <Settings size={16} />
                        Cài đặt công ty
                     </Link>
                  </>
               )}
            </div>

            <div className='border-t p-3'>
               <Button
                  variant='outline'
                  className='flex w-full items-center justify-center gap-2 rounded-full !border-none bg-red-50 py-2 text-red-600 hover:bg-red-100'
                  onClick={handleLogout}
               >
                  <LogOut size={16} />
                  Đăng xuất
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   )
}
