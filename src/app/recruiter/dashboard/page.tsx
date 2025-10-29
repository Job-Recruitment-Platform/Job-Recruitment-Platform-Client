'use client'

import { Briefcase, FileText, Users, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { statisticService } from '@/services/statistic.service'
import { useMemo } from 'react'

function formatRelativeTime(dateString: string): string {
   const date = new Date(dateString)
   const now = new Date()
   const diffMs = now.getTime() - date.getTime()
   const diffMins = Math.floor(diffMs / 60000)
   const diffHours = Math.floor(diffMs / 3600000)
   const diffDays = Math.floor(diffMs / 86400000)

   if (diffMins < 1) return 'Vừa xong'
   if (diffMins < 60) return `${diffMins} phút trước`
   if (diffHours < 24) return `${diffHours} giờ trước`
   if (diffDays === 1) return 'Hôm qua'
   if (diffDays < 7) return `${diffDays} ngày trước`
   if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`
   return date.toLocaleDateString('vi-VN')
}

export default function RecruiterDashboardPage() {
   const { data, isLoading, isError } = useQuery({
      queryKey: ['recruiter-statistics'],
      queryFn: () => statisticService.getStatistics(),
      refetchOnWindowFocus: false
   })

   const statistics = data?.data

   const weeklyData = useMemo(() => {
      if (!statistics?.weeklyApplicationCount) return { data: [], labels: [] }
      
      const entries = Object.entries(statistics.weeklyApplicationCount)
         .sort(([a], [b]) => Number(a) - Number(b))
         .slice(-8)
      
      return {
         data: entries.map(([_, count]) => count),
         labels: entries.map(([week]) => `W${week}`)
      }
   }, [statistics?.weeklyApplicationCount])

   if (isLoading) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
         </div>
      )
   }

   if (isError) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <div className='text-center'>
               <p className='text-gray-500'>Không thể tải dữ liệu thống kê</p>
               <p className='mt-2 text-sm text-gray-400'>Vui lòng thử lại sau</p>
            </div>
         </div>
      )
   }

   return (
      <div className='space-y-6'>
         <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
            <div>
               <div className='text-xl font-semibold'>Tổng quan nhà tuyển dụng</div>
               <div className='text-sm text-gray-500'>Theo dõi hiệu quả tuyển dụng và quản lý tin đăng</div>
            </div>
            <Link
               href='/job/save'
               className='inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90'
            >
               <Briefcase size={16} />
               Đăng tin tuyển dụng
            </Link>
         </div>

         <div className='rounded-md border bg-white p-4'>
            <div className='mb-4 flex items-center justify-between'>
               <div className='text-sm font-semibold'>Ứng tuyển theo tuần</div>
               <div className='text-xs text-gray-500'>{weeklyData.labels.length} tuần gần nhất</div>
            </div>
            <ApplicationsChart data={weeklyData.data} labels={weeklyData.labels} />
         </div>

         <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <StatCard 
               icon={Briefcase} 
               label='Tin đang đăng' 
               value={statistics?.currentPublishJobCount?.toString() || '0'} 
            />
            <StatCard 
               icon={Users} 
               label='Ứng viên mới' 
               value={statistics?.totalNewApplicationCount?.toString() || '0'} 
            />
            <StatCard 
               icon={FileText} 
               label='Hồ sơ chờ duyệt' 
               value={statistics?.totalPendingApplicationCount?.toString() || '0'} 
            />
         </div>

         <div className='grid gap-4 lg:grid-cols-2'>
            <div className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Tin tuyển dụng gần đây</div>
               <div className='divide-y'>
                  {statistics?.newestJobs && statistics.newestJobs.length > 0 ? (
                     statistics.newestJobs.slice(0, 3).map((job, idx) => (
                        <div key={idx} className='flex items-center justify-between p-4 text-sm'>
                           <div className='min-w-0 flex-1'>
                              <div className='truncate font-medium'>{job.title}</div>
                              <div className='mt-1 flex items-center gap-2 text-xs text-gray-500'>
                                 <span>{job.company}</span>
                                 <span>•</span>
                                 <span>{job.location}</span>
                              </div>
                           </div>
                           <div className='ml-3 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700'>
                              {job.work_mode}
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className='flex h-32 items-center justify-center text-sm text-gray-400'>
                        Chưa có tin tuyển dụng
                     </div>
                  )}
               </div>
               <div className='p-4'>
                  <Link href='/recruiter/job' className='text-sm text-primary hover:underline'>
                     Xem tất cả tin tuyển dụng
                  </Link>
               </div>
            </div>

            <div className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Ứng viên mới</div>
               <div className='divide-y'>
                  {statistics?.newestJobApplications && statistics.newestJobApplications.length > 0 ? (
                     statistics.newestJobApplications.slice(0, 3).map((application, idx) => (
                        <div key={idx} className='flex items-center justify-between p-4 text-sm'>
                           <div className='min-w-0 flex-1'>
                              <div className='truncate font-medium'>{application.candidateName}</div>
                              <div className='truncate text-gray-500'>{application.jobTitle}</div>
                           </div>
                           <div className='ml-3 text-xs text-gray-500'>
                              {formatRelativeTime(application.appliedAt)}
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className='flex h-32 items-center justify-center text-sm text-gray-400'>
                        Chưa có ứng viên mới
                     </div>
                  )}
               </div>
               <div className='p-4'>
                  <Link href='/recruiter/job' className='text-sm text-primary hover:underline'>
                     Xem tất cả ứng viên
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
   return (
      <div className='rounded-md border bg-white p-4'>
         <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Icon size={16} />
            {label}
         </div>
         <div className='mt-2 text-2xl font-bold'>{value}</div>
      </div>
   )
}

function ApplicationsChart({ data, labels }: { data: number[]; labels: string[] }) {
   if (!data || data.length === 0) {
      return (
         <div className='flex h-[240px] items-center justify-center text-sm text-gray-400'>
            Chưa có dữ liệu ứng tuyển
         </div>
      )
   }

   const width = 800
   const height = 240
   const paddingX = 32
   const paddingY = 24
   const innerWidth = width - paddingX * 2
   const innerHeight = height - paddingY * 2
   const maxY = Math.max(...data, 1) * 1.2

   const points = data
      .map((value, index) => {
         const x = paddingX + (index / (data.length - 1)) * innerWidth
         const y = paddingY + innerHeight - (value / maxY) * innerHeight
         return `${x},${y}`
      })
      .join(' ')

   const areaPoints = `${paddingX},${paddingY + innerHeight} ${points} ${paddingX + innerWidth},${paddingY + innerHeight}`

   return (
      <div className='w-full overflow-x-auto'>
         <svg width={width} height={height} className='min-w-full'>
            <defs>
               <linearGradient id='areaGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='rgb(59 130 246)' stopOpacity='0.25' />
                  <stop offset='100%' stopColor='rgb(59 130 246)' stopOpacity='0' />
               </linearGradient>
            </defs>

            <g>
               <line x1={paddingX} y1={paddingY + innerHeight} x2={paddingX + innerWidth} y2={paddingY + innerHeight} stroke='#e5e7eb' />
               {data.map((_, i) => (
                  <line
                     key={i}
                     x1={paddingX + (i / (data.length - 1)) * innerWidth}
                     y1={paddingY}
                     x2={paddingX + (i / (data.length - 1)) * innerWidth}
                     y2={paddingY + innerHeight}
                     stroke='#f3f4f6'
                  />
               ))}
            </g>

            <polygon points={areaPoints} fill='url(#areaGradient)' />
            <polyline points={points} fill='none' stroke='rgb(59 130 246)' strokeWidth='2' />

            {data.map((value, index) => {
               const x = paddingX + (index / (data.length - 1)) * innerWidth
               const y = paddingY + innerHeight - (value / maxY) * innerHeight
               return <circle key={index} cx={x} cy={y} r='3' fill='rgb(59 130 246)' />
            })}

            {labels.map((label, index) => {
               const x = paddingX + (index / (labels.length - 1)) * innerWidth
               return (
                  <text key={index} x={x} y={height - 4} textAnchor='middle' fontSize='10' fill='#6b7280'>
                     {label}
                  </text>
               )
            })}
         </svg>
      </div>
   )
}


