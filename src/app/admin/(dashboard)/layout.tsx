'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
   LayoutDashboard,
   Building2,
   Briefcase,
   Shield,
   Settings,
   LogOut,
   Menu,
   X
} from 'lucide-react'
import { showSuccessToast } from '@/lib/toast'
import '@/styles/admin.css'

export default function AdminDashboardLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   const pathname = usePathname()
   const router = useRouter()
   const [sidebarOpen, setSidebarOpen] = useState(false)

   const navItems = [
      { href: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
      { href: '/admin/companies/verify', label: 'Xác thực công ty', icon: Building2 },
      { href: '/admin/jobs/verify', label: 'Quản lý tin tuyển dụng', icon: Briefcase },
      { href: '/admin/settings', label: 'Cài đặt hệ thống', icon: Settings }
   ]

   const handleLogout = () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      showSuccessToast('Đăng xuất thành công')
      router.push('/admin/login')
   }

   return (
      <div className='flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
         {/* Fixed Sidebar - Desktop */}
         <aside className='admin-sidebar admin-sidebar-bg fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col shadow-xl lg:flex'>
            {/* Sidebar Header */}
            <div className='admin-sidebar-header flex h-16 items-center gap-2.5 px-6'>
               <div className='rounded-lg bg-white/20 p-1.5 backdrop-blur-sm'>
                  <Shield className='h-5 w-5 text-white' />
               </div>
               <span className='text-lg font-bold text-white'>Admin Dashboard</span>
            </div>

            {/* Navigation */}
            <nav className='admin-sidebar-nav flex-1 space-y-1 overflow-y-auto px-3 py-4'>
               {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname?.startsWith(item.href)
                  return (
                     <Link
                        key={item.href}
                        href={item.href}
                        className={`admin-interactive flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                           isActive
                              ? 'sidebar-link-active text-white shadow-md'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                     >
                        <Icon size={18} />
                        {item.label}
                     </Link>
                  )
               })}
            </nav>

            {/* Logout Button */}
            <div className='border-t border-white/10 p-3'>
               <button
                  onClick={handleLogout}
                  className='admin-interactive flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-300'
               >
                  <LogOut size={18} />
                  Đăng xuất
               </button>
            </div>
         </aside>

         {/* Mobile Sidebar Overlay */}
         {sidebarOpen && (
            <button
               type='button'
               className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden'
               onClick={() => setSidebarOpen(false)}
               aria-label='Close sidebar'
            />
         )}

         {/* Mobile Sidebar */}
         <aside
            className={`admin-sidebar-bg mobile-sidebar-enter fixed top-0 left-0 z-50 h-screen w-64 transform shadow-2xl transition-transform duration-300 lg:hidden ${
               sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
         >
            {/* Mobile Sidebar Header */}
            <div className='admin-sidebar-header flex h-16 items-center justify-between px-6'>
               <div className='flex items-center gap-2'>
                  <div className='rounded-lg bg-white/20 p-1.5'>
                     <Shield className='h-5 w-5 text-white' />
                  </div>
                  <span className='text-lg font-bold text-white'>Admin Dashboard</span>
               </div>
               <button
                  onClick={() => setSidebarOpen(false)}
                  className='rounded-lg p-1 text-white hover:bg-white/10'
               >
                  <X size={20} />
               </button>
            </div>

            {/* Mobile Navigation */}
            <nav className='space-y-1 overflow-y-auto px-3 py-4'>
               {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname?.startsWith(item.href)
                  return (
                     <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`admin-interactive flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                           isActive
                              ? 'sidebar-link-active text-white'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                     >
                        <Icon size={18} />
                        {item.label}
                     </Link>
                  )
               })}
            </nav>

            {/* Mobile Logout */}
            <div className='absolute bottom-0 w-full border-t border-white/10 p-3'>
               <button
                  onClick={handleLogout}
                  className='admin-interactive flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-300'
               >
                  <LogOut size={18} />
                  Đăng xuất
               </button>
            </div>
         </aside>

         {/* Main Content Area */}
         <div className='flex flex-1 flex-col lg:ml-64'>
            {/* Top Header */}
            <header className='admin-glass-header sticky top-0 z-30 flex h-16 items-center justify-between px-4 shadow-sm lg:px-6'>
               {/* Mobile Menu Button */}
               <button
                  onClick={() => setSidebarOpen(true)}
                  className='admin-interactive rounded-lg p-2 hover:bg-gray-100 lg:hidden'
               >
                  <Menu size={20} />
               </button>

               {/* Page Title - Desktop */}
               {/* <div className='hidden lg:block'>
                  <h1 className='text-lg font-semibold text-gray-900'>
                     {navItems.find((item) => pathname?.startsWith(item.href))?.label ||
                        'Dashboard'}
                  </h1>
               </div> */}

               {/* User Info / Actions */}
               <div className='hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 sm:flex'>
                  <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-500'></div>
                  <span className='text-sm font-medium text-emerald-700'>Admin</span>
               </div>
            </header>

            {/* Page Content */}
            <main className='flex-1 p-4 lg:p-6'>{children}</main>

            {/* Footer */}
            <footer className='border-t border-gray-200 bg-white/50 py-4 backdrop-blur-sm'>
               <div className='px-4 text-center text-sm text-gray-600 lg:px-6'>
                  © 2025 BotCV Admin Dashboard · Powered by AI
               </div>
            </footer>
         </div>
      </div>
   )
}
