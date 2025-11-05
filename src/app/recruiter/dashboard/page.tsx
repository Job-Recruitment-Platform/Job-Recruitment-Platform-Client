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
               href='/recruiter/job/create'
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
                        <Link 
                           key={idx} 
                           href={`/job/${job.id}/detail`}
                           className='block p-4 transition-colors hover:bg-gray-50'
                        >
                           <div className='mb-2'>
                              <div className='mb-1 font-medium text-gray-900'>{job.title}</div>
                              <div className='text-sm text-gray-600'>{job.company}</div>
                           </div>
                           <div className='flex flex-wrap items-center gap-2'>
                              <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                                 <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                 </svg>
                                 {job.location}
                              </div>
                              <span className='text-gray-300'>•</span>
                              <div className='rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700'>
                                 {job.workMode}
                              </div>
                              <span className='text-gray-300'>•</span>
                              {job.salaryMin && job.salaryMax && (
                                 <>
                                    <span className='text-gray-300'>•</span>
                                    <div className='text-xs font-medium text-green-600'>
                                       {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}
                                    </div>
                                 </>
                              )}
                           </div>
                        </Link>
                     ))
                  ) : (
                     <div className='flex h-32 items-center justify-center text-sm text-gray-400'>
                        Chưa có tin tuyển dụng
                     </div>
                  )}
               </div>
               <div className='border-t p-4'>
                  <Link href='/recruiter/job' className='text-sm font-medium text-primary hover:underline'>
                     Xem tất cả tin tuyển dụng →
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


