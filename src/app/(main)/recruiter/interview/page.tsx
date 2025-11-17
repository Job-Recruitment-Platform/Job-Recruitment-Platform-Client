'use client'

import { Calendar, Clock, MapPin, User, Briefcase, Search, Loader2, Filter } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { recruiterService } from '@/services/recruiter.service'
import { InterviewResponse, InterviewStatus } from '@/types/interview.type'
import { Input } from '@/components/ui/input'
import Button from '@/components/shared/Button'
import Pagination from '@/components/ui/pagination'

export default function InterviewPage() {
   const [page, setPage] = useState(1)
   const [search, setSearch] = useState('')
   const [statusFilter, setStatusFilter] = useState<InterviewStatus | 'all'>('all')
   const pageSize = 10

   // Fetch interviews
   const { data: interviewsData, isLoading, isError } = useQuery({
      queryKey: ['company-interviews'],
      queryFn: () => recruiterService.getCompanyInterviews(),
      refetchOnWindowFocus: false
   })

   const interviews = (interviewsData?.data?.content || []) as InterviewResponse[]

   // Filter and search interviews
   const filtered = useMemo(() => {
      return interviews.filter((interview) => {
         const matchStatus = statusFilter === 'all' || interview.status === statusFilter
         const searchLower = search.toLowerCase().trim()
         const matchSearch =
            !searchLower ||
            interview.candidateName.toLowerCase().includes(searchLower) ||
            interview.jobTitle.toLowerCase().includes(searchLower)
         return matchStatus && matchSearch
      })
   }, [interviews, search, statusFilter])

   // Pagination
   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
   const paginatedInterviews = useMemo(() => {
      const start = (page - 1) * pageSize
      return filtered.slice(start, start + pageSize)
   }, [filtered, page])

   // Status counts
   const statusCounts = useMemo(() => {
      const all = interviews.length
      const scheduled = interviews.filter((i) => i.status === InterviewStatus.SCHEDULED).length
      const completed = interviews.filter((i) => i.status === InterviewStatus.COMPLETED).length
      const canceled = interviews.filter((i) => i.status === InterviewStatus.CANCELED).length
      const noShow = interviews.filter((i) => i.status === InterviewStatus.NO_SHOW).length
      return { all, scheduled, completed, canceled, noShow }
   }, [interviews])

   // Format date and time
   const formatDateTime = (dateString: string): { date: string; time: string } => {
      const date = new Date(dateString)
      const dateStr = date.toLocaleDateString('vi-VN', {
         weekday: 'short',
         year: 'numeric',
         month: 'long',
         day: 'numeric'
      })
      const timeStr = date.toLocaleTimeString('vi-VN', {
         hour: '2-digit',
         minute: '2-digit'
      })
      return { date: dateStr, time: timeStr }
   }

   // Format location
   const formatLocation = (location: any): string => {
      if (!location) return 'Chưa có địa điểm'
      const parts = [
         location.streetAddress,
         location.ward,
         location.district,
         location.provinceCity,
         location.country
      ].filter(Boolean)
      return parts.length > 0 ? parts.join(', ') : 'Chưa có địa điểm'
   }

   // Get status label
   const getStatusLabel = (status: InterviewStatus): string => {
      switch (status) {
         case InterviewStatus.SCHEDULED:
            return 'Đã lên lịch'
         case InterviewStatus.COMPLETED:
            return 'Đã hoàn thành'
         case InterviewStatus.CANCELED:
            return 'Đã hủy'
         case InterviewStatus.NO_SHOW:
            return 'Không đến'
         default:
            return status
      }
   }

   // Get status style
   const getStatusStyle = (status: InterviewStatus): string => {
      switch (status) {
         case InterviewStatus.SCHEDULED:
            return 'bg-blue-100 text-blue-700'
         case InterviewStatus.COMPLETED:
            return 'bg-green-100 text-green-700'
         case InterviewStatus.CANCELED:
            return 'bg-red-100 text-red-700'
         case InterviewStatus.NO_SHOW:
            return 'bg-orange-100 text-orange-700'
         default:
            return 'bg-gray-100 text-gray-700'
      }
   }

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
               <p className='text-gray-500'>Không thể tải danh sách phỏng vấn</p>
            </div>
         </div>
      )
   }

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='space-y-3'>
            <div>
               <h1 className='text-2xl font-semibold'>Quản lý phỏng vấn</h1>
               <p className='text-sm text-gray-500'>Xem và quản lý các buổi phỏng vấn của bạn</p>
            </div>

            {/* Search and Filters */}
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
               <div className='w-full sm:w-80'>
                  <div className='relative'>
                     <Search
                        className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                        size={16}
                     />
                     <Input
                        placeholder='Tìm theo tên ứng viên, chức danh...'
                        value={search}
                        onChange={(e) => {
                           setSearch(e.target.value)
                           setPage(1)
                        }}
                        className='pl-9'
                        aria-label='Tìm kiếm phỏng vấn'
                     />
                  </div>
               </div>
               <div className='-mx-2 overflow-x-auto pb-1'>
                  <div className='mx-2 flex items-center gap-2 whitespace-nowrap sm:gap-3'>
                     {([
                        { key: 'all' as const, label: 'Tất cả', count: statusCounts.all },
                        {
                           key: InterviewStatus.SCHEDULED,
                           label: 'Đã lên lịch',
                           count: statusCounts.scheduled
                        },
                        {
                           key: InterviewStatus.COMPLETED,
                           label: 'Đã hoàn thành',
                           count: statusCounts.completed
                        },
                        {
                           key: InterviewStatus.CANCELED,
                           label: 'Đã hủy',
                           count: statusCounts.canceled
                        },
                        {
                           key: InterviewStatus.NO_SHOW,
                           label: 'Không đến',
                           count: statusCounts.noShow
                        }
                     ]).map((tab) => {
                        const isActive = statusFilter === tab.key
                        return (
                           <button
                              key={tab.key}
                              onClick={() => {
                                 setStatusFilter(tab.key)
                                 setPage(1)
                              }}
                              className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                 isActive
                                    ? 'border-primary bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                           >
                              <span className={`font-medium ${isActive ? 'text-primary' : 'text-gray-700'}`}>
                                 {tab.label}
                              </span>
                              <span
                                 className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                    isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                                 }`}
                              >
                                 {tab.count}
                              </span>
                           </button>
                        )
                     })}
                  </div>
               </div>
            </div>
         </div>

         {/* Interviews List */}
         <div className='overflow-hidden rounded-md border bg-white'>
            {paginatedInterviews.length === 0 ? (
               <div className='flex h-64 items-center justify-center text-center'>
                  <div className='space-y-2'>
                     <Calendar className='mx-auto h-12 w-12 text-gray-400' />
                     <p className='text-sm font-medium text-gray-500'>
                        {search || statusFilter !== 'all'
                           ? 'Không tìm thấy phỏng vấn phù hợp'
                           : 'Chưa có buổi phỏng vấn nào'}
                     </p>
                  </div>
               </div>
            ) : (
               <div className='divide-y'>
                  {paginatedInterviews.map((interview) => {
                     const { date, time } = formatDateTime(interview.scheduledAt)
                     const locationStr = formatLocation(interview.location)

                     return (
                        <div key={interview.id} className='p-6 transition-colors hover:bg-gray-50'>
                           <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                              {/* Left: Candidate and Job Info */}
                              <div className='flex-1 space-y-3'>
                                 <div className='flex items-start gap-4'>
                                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10'>
                                       <User className='h-6 w-6 text-primary' />
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                       <div className='mb-1 flex items-center gap-2'>
                                          <Link
                                             href={`/recruiter/interview/${interview.id}`}
                                             className='text-lg font-semibold text-gray-900 hover:text-primary transition-colors cursor-pointer'
                                          >
                                             {interview.candidateName}
                                          </Link>
                                          <span
                                             className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusStyle(
                                                interview.status
                                             )}`}
                                          >
                                             {getStatusLabel(interview.status)}
                                          </span>
                                       </div>
                                       <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                                          <Briefcase size={14} />
                                          <span>{interview.jobTitle}</span>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Date, Time, Location */}
                                 <div className='ml-16 grid gap-2 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-3'>
                                    <div className='flex items-center gap-2'>
                                       <Calendar size={14} className='shrink-0 text-gray-400' />
                                       <span>{date}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                       <Clock size={14} className='shrink-0 text-gray-400' />
                                       <span>{time}</span>
                                    </div>
                                    <div className='flex items-start gap-2 sm:col-span-2 lg:col-span-1'>
                                       <MapPin size={14} className='mt-0.5 shrink-0 text-gray-400' />
                                       <span className='line-clamp-2'>{locationStr}</span>
                                    </div>
                                 </div>

                                 {/* Notes */}
                                 {interview.notes && (
                                    <div className='ml-16 rounded-md bg-gray-50 p-3 text-sm text-gray-700'>
                                       <p className='font-medium'>Ghi chú:</p>
                                       <p className='mt-1'>{interview.notes}</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            )}
         </div>

         {/* Pagination */}
         {filtered.length > 0 && (
            <div className='flex items-center justify-between'>
               <div className='text-xs text-gray-500'>
                  Hiển thị {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} trong số{' '}
                  {filtered.length} phỏng vấn
               </div>
               <Pagination
                  onPrev={() => setPage((p) => Math.max(1, p - 1))}
                  onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabledPrev={page === 1}
                  disabledNext={page === totalPages}
               >
                  {Array.from({ length: totalPages }).map((_, i) => {
                     const pageNum = i + 1
                     const isActive = pageNum === page
                     return (
                        <Button
                           key={pageNum}
                           variant={isActive ? 'primary' : 'outline'}
                           className='rounded-full px-3 py-1 text-xs'
                           onClick={() => setPage(pageNum)}
                        >
                           {pageNum}
                        </Button>
                     )
                  })}
               </Pagination>
            </div>
         )}
      </div>
   )
}

