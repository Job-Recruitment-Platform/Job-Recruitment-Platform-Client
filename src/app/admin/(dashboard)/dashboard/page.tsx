'use client'

import { useQuery } from '@tanstack/react-query'
import { statisticService } from '@/services/statistic.service'
import {
   Users,
   UserCheck,
   Building2,
   Briefcase,
   AlertCircle,
   TrendingUp,
   Loader2,
   ArrowUpRight
} from 'lucide-react'

export default function AdminDashboardPage() {
   const { data: stats, isLoading } = useQuery({
      queryKey: ['admin-statistics'],
      queryFn: () => statisticService.getAdminStatistics(),
      refetchOnWindowFocus: false
   })

   if (isLoading) {
      return (
         <div className='flex h-96 items-center justify-center'>
            <div className='text-center'>
               <Loader2 className='text-primary mx-auto h-10 w-10 animate-spin' />
               <p className='mt-3 text-sm text-gray-500'>Đang tải dữ liệu...</p>
            </div>
         </div>
      )
   }

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='admin-dashboard-header rounded-xl p-6 text-white shadow-lg'>
            <h1 className='text-3xl font-bold'>Chào mừng trở lại! 👋</h1>
            <p className='mt-2 text-emerald-100'>
               Tổng quan hệ thống tuyển dụng · Cập nhật mới nhất
            </p>
         </div>

         {/* Overview Stats */}
         <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
            <StatCard
               icon={Users}
               label='Tổng tài khoản'
               value={stats?.totalAccount || 0}
               iconColor='text-blue-600'
               bgColor='bg-blue-50'
               borderColor='border-blue-200'
            />
            <StatCard
               icon={UserCheck}
               label='Ứng viên'
               value={stats?.totalCandidate || 0}
               iconColor='text-green-600'
               bgColor='bg-green-50'
               borderColor='border-green-200'
            />
            <StatCard
               icon={UserCheck}
               label='Nhà tuyển dụng'
               value={stats?.totalRecruiter || 0}
               iconColor='text-purple-600'
               bgColor='bg-purple-50'
               borderColor='border-purple-200'
            />
            <StatCard
               icon={Building2}
               label='Công ty'
               value={stats?.totalCompany || 0}
               iconColor='text-orange-600'
               bgColor='bg-orange-50'
               borderColor='border-orange-200'
            />
            <StatCard
               icon={Briefcase}
               label='Tin tuyển dụng'
               value={stats?.totalJob || 0}
               iconColor='text-cyan-600'
               bgColor='bg-cyan-50'
               borderColor='border-cyan-200'
            />
         </div>

         {/* Pending Actions */}
         <div className='grid gap-4 md:grid-cols-2'>
            <AlertCard
               icon={AlertCircle}
               label='Công ty chờ xác thực'
               value={stats?.pendingCompanyVerification || 0}
               href='/admin/companies/verify'
            />
            <AlertCard
               icon={AlertCircle}
               label='Tin tuyển dụng chờ duyệt'
               value={stats?.pendingJobApproval || 0}
               href='/admin/jobs/verify'
            />
         </div>

         {/* Weekly Growth Chart */}
         <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-6 flex items-center justify-between'>
               <div className='flex items-center gap-2'>
                  <div className='bg-primary/10 rounded-lg p-2'>
                     <TrendingUp className='text-primary h-5 w-5' />
                  </div>
                  <h2 className='text-lg font-semibold text-gray-900'>Tăng trưởng tuần này</h2>
               </div>
               <span className='text-xs font-medium text-gray-500'>7 ngày qua</span>
            </div>
            <WeeklyChart
               newAccounts={stats?.weeklyNewAccount || 0}
               newJobs={stats?.weeklyNewJob || 0}
            />
         </div>
      </div>
   )
}

// Enhanced Stat Card Component
function StatCard({
   icon: Icon,
   label,
   value,
   iconColor,
   bgColor,
   borderColor
}: {
   icon: any
   label: string
   value: number
   iconColor: string
   bgColor: string
   borderColor: string
}) {
   return (
      <div className={`stat-card rounded-xl border ${borderColor} bg-white p-5 shadow-sm`}>
         <div className='flex items-start justify-between'>
            <div className={`rounded-lg ${bgColor} p-3`}>
               <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <ArrowUpRight className='h-4 w-4 text-green-500' />
         </div>
         <div className='mt-4'>
            <div className='text-3xl font-bold text-gray-900'>{value.toLocaleString()}</div>
            <div className='mt-1 text-sm font-medium text-gray-500'>{label}</div>
         </div>
      </div>
   )
}

// Enhanced Alert Card Component
function AlertCard({
   icon: Icon,
   label,
   value,
   href
}: {
   icon: any
   label: string
   value: number
   href: string
}) {
   return (
      <a href={href} className='alert-card group block rounded-xl p-6 shadow-md'>
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
               <div className='pending-badge rounded-full bg-amber-100 p-3'>
                  <Icon className='h-6 w-6 text-amber-600' />
               </div>
               <div>
                  <div className='text-4xl font-bold text-amber-900'>{value}</div>
                  <div className='mt-1 text-sm font-semibold text-amber-700'>{label}</div>
               </div>
            </div>
            <div className='rounded-full bg-white p-2 shadow-sm transition-transform group-hover:translate-x-1'>
               <ArrowUpRight className='h-5 w-5 text-amber-600' />
            </div>
         </div>
      </a>
   )
}

// Enhanced Weekly Chart Component
function WeeklyChart({ newAccounts, newJobs }: { newAccounts: number; newJobs: number }) {
   const maxValue = Math.max(newAccounts, newJobs, 1)
   const accountHeight = (newAccounts / maxValue) * 100
   const jobHeight = (newJobs / maxValue) * 100

   return (
      <div className='space-y-6'>
         {/* Chart */}
         <div className='flex h-56 items-end gap-12 px-4'>
            {/* Accounts Bar */}
            <div className='flex flex-1 flex-col items-center gap-3'>
               <div className='relative w-full'>
                  <div
                     className='chart-bar w-full rounded-t-xl bg-gradient-to-t from-blue-500 to-blue-400 shadow-lg'
                     style={{ height: `${accountHeight}%`, minHeight: '30px' }}
                  >
                     <div className='absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-blue-50 px-3 py-1 text-base font-bold text-blue-700 shadow-sm'>
                        {newAccounts}
                     </div>
                  </div>
               </div>
               <div className='text-center'>
                  <div className='text-sm font-semibold text-gray-700'>Tài khoản mới</div>
                  <div className='text-xs text-gray-500'>Tuần này</div>
               </div>
            </div>

            {/* Jobs Bar */}
            <div className='flex flex-1 flex-col items-center gap-3'>
               <div className='relative w-full'>
                  <div
                     className='chart-bar w-full rounded-t-xl bg-gradient-to-t from-green-500 to-green-400 shadow-lg'
                     style={{ height: `${jobHeight}%`, minHeight: '30px' }}
                  >
                     <div className='absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-green-50 px-3 py-1 text-base font-bold text-green-700 shadow-sm'>
                        {newJobs}
                     </div>
                  </div>
               </div>
               <div className='text-center'>
                  <div className='text-sm font-semibold text-gray-700'>Tin tuyển dụng mới</div>
                  <div className='text-xs text-gray-500'>Tuần này</div>
               </div>
            </div>
         </div>

         {/* Legend */}
         <div className='flex items-center justify-center gap-8 rounded-lg bg-gray-50 py-3'>
            <div className='flex items-center gap-2'>
               <div className='h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 shadow-sm'></div>
               <span className='text-sm font-medium text-gray-700'>Tài khoản</span>
            </div>
            <div className='flex items-center gap-2'>
               <div className='h-4 w-4 rounded-full bg-gradient-to-r from-green-500 to-green-400 shadow-sm'></div>
               <span className='text-sm font-medium text-gray-700'>Tin tuyển dụng</span>
            </div>
         </div>
      </div>
   )
}
