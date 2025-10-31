'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Briefcase, LayoutDashboard, PlusCircle, Settings, User } from 'lucide-react'

export default function RecruiterLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   const pathname = usePathname()

   const navItems = [
      { href: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/recruiter/job', label: 'Tin tuyển dụng', icon: Briefcase },
      { href: '/recruiter/settings/profile', label: 'Hồ sơ cá nhân', icon: User },
      { href: '/recruiter/settings/company', label: 'Hồ sơ công ty', icon: Settings }
   ]

   const hideSidebar = pathname?.startsWith('/recruiter/register')

   return (
      <div className='container mx-auto py-6'>
         <div className='flex gap-6'>
            {!hideSidebar && (
               <aside className='hidden w-64 shrink-0 md:block'>
               <div className='top-24 space-y-2 rounded-md border bg-white p-3'>
                  <div className='flex items-center gap-2 px-2 py-1.5 text-sm font-semibold'>
                     <Building2 size={16} />
                     Khu vực nhà tuyển dụng
                  </div>
                  <nav className='space-y-1'>
                     {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname?.startsWith(item.href)
                        return (
                           <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-2 rounded px-2 py-2 text-sm transition-colors ${
                                 isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                              }`}
                           >
                              <Icon size={16} />
                              {item.label}
                           </Link>
                        )
                     })}
                  </nav>
                  <Link
                     href='/recruiter/job/create'
                     className='mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90'
                  >
                     <PlusCircle size={16} />
                     Đăng tin tuyển dụng
                  </Link>
               </div>
               </aside>
            )}

            <main className='min-w-0 flex-1'>
               {children}
            </main>
         </div>
      </div>
   )
}


