'use client'

import Button from '@/components/shared/Button'
import Pagination from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import candidateService from '@/services/candidate.service'
import { resourceService } from '@/services/resource.service'
import { ApplicationStatus, JobApplicationResponse } from '@/types/job.type'
import {
   Briefcase,
   Building2,
   Calendar,
   Clock,
   Download,
   FileText,
   Loader2,
   MapPin,
   Search,
   Wallet
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'

const PAGE_SIZE = 10

// Status labels and colors
const STATUS_LABELS: Record<ApplicationStatus, string> = {
   [ApplicationStatus.SUBMITTED]: 'Đã nộp',
   [ApplicationStatus.REVIEWED]: 'Đã xem',
   [ApplicationStatus.INTERVIEW]: 'Phỏng vấn',
   [ApplicationStatus.OFFERED]: 'Đã nhận offer',
   [ApplicationStatus.REJECTED]: 'Bị từ chối'
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
   [ApplicationStatus.SUBMITTED]: 'bg-blue-100 text-blue-800 border-blue-200',
   [ApplicationStatus.REVIEWED]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
   [ApplicationStatus.INTERVIEW]: 'bg-purple-100 text-purple-800 border-purple-200',
   [ApplicationStatus.OFFERED]: 'bg-green-100 text-green-800 border-green-200',
   [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200'
}

export default function MyJobsPage() {
   const [applications, setApplications] = useState<JobApplicationResponse[]>([])
   const [loading, setLoading] = useState(true)
   const [page, setPage] = useState(1)
   const [search, setSearch] = useState('')
   const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
   const [downloadingId, setDownloadingId] = useState<number | null>(null)
   const [paginationData, setPaginationData] = useState<{
      totalElements: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
   } | null>(null)

   useEffect(() => {
      loadApplications(page)
   }, [page])

   const loadApplications = async (pageToLoad: number = page) => {
      try {
         setLoading(true)
         const normalizedPage = pageToLoad < 1 ? 1 : pageToLoad
         const res = await candidateService.getCandidateApplications(normalizedPage, PAGE_SIZE)

         if (res?.data?.content && Array.isArray(res.data.content)) {
            setApplications(res.data.content)
            const totalElements = res.data.totalElements ?? res.data.content.length
            let totalPages = res.data.totalPages ?? 0
            if (totalPages <= 0 && totalElements > 0) {
               totalPages = Math.ceil(totalElements / PAGE_SIZE)
            }
            const hasPrevious = normalizedPage > 1 && totalPages > 0
            const hasNext = totalPages > 0 && normalizedPage < totalPages
            setPaginationData({
               totalElements,
               totalPages,
               hasNext,
               hasPrevious
            })
            if (totalPages > 0 && normalizedPage > totalPages) {
               setPage(totalPages)
            }
         } else {
            setApplications([])
            setPaginationData(null)
         }
      } catch (err) {
         console.error('Load applications error:', err)
         showErrorToast('Không tải được danh sách ứng tuyển')
      } finally {
         setLoading(false)
      }
   }

   // Filter applications
   const filteredApplications = useMemo(() => {
      return applications.filter((app) => {
         const matchStatus = statusFilter === 'all' || app.status === statusFilter
         const searchLower = search.toLowerCase().trim()
         const matchSearch =
            !searchLower ||
            app.jobResponse.title.toLowerCase().includes(searchLower) ||
            app.company.name.toLowerCase().includes(searchLower) ||
            app.jobResponse.location.toLowerCase().includes(searchLower)
         return matchStatus && matchSearch
      })
   }, [applications, search, statusFilter])

   const formatDate = (date: string | Date) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return dateObj.toLocaleDateString('vi-VN', {
         year: 'numeric',
         month: 'long',
         day: 'numeric'
      })
   }

   const formatSalary = (min?: number, max?: number, currency?: string) => {
      if (!min && !max) return 'Thỏa thuận'
      const formatNumber = (num: number) => {
         if (currency === 'VND') {
            return num >= 1000000
               ? `${(num / 1000000).toFixed(0)} triệu`
               : `${num.toLocaleString('vi-VN')}`
         }
         return num.toLocaleString('vi-VN')
      }
      if (min && max) {
         return `${formatNumber(min)} - ${formatNumber(max)} ${currency || 'VND'}`
      }
      return min ? `Từ ${formatNumber(min)} ${currency || 'VND'}` : `Đến ${formatNumber(max!)} ${currency || 'VND'}`
   }

   const getWorkModeLabel = (mode: string) => {
      const labels: Record<string, string> = {
         ONSITE: 'Tại văn phòng',
         REMOTE: 'Từ xa',
         HYBRID: 'Linh hoạt'
      }
      return labels[mode] || mode
   }

   const handleDownloadCV = async (cvResource: any, appId: number) => {
      try {
         setDownloadingId(appId)
         const arrayBuffer = await resourceService.downloadResource(cvResource.url)
         if (arrayBuffer) {
            // Create blob from ArrayBuffer
            const blob = new Blob([arrayBuffer], { type: cvResource.mimeType || 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = cvResource.name || 'CV.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            showSuccessToast('Tải CV thành công')
         }
      } catch (error) {
         console.error('Error downloading CV:', error)
         showErrorToast('Không thể tải CV')
      } finally {
         setDownloadingId(null)
      }
   }

   return (
      <div className='bg-smoke min-h-screen py-6'>
         <div className='container mx-auto max-w-6xl px-4'>
            {/* Header */}
            <div className='mb-6'>
               <h1 className='mb-2 text-2xl font-bold text-gray-900'>Việc làm đã ứng tuyển</h1>
               <p className='text-sm text-gray-600'>
                  Quản lý và theo dõi trạng thái các đơn ứng tuyển của bạn
               </p>
            </div>

            {/* Filters */}
            <div className='mb-6 flex flex-col gap-4 rounded-lg border bg-white p-4 sm:flex-row sm:items-center'>
               <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <Input
                     type='text'
                     placeholder='Tìm kiếm công việc, công ty...'
                     value={search}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                     className='pl-10'
                  />
               </div>
               <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600'>Trạng thái:</span>
                  <select
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
                     className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  >
                     <option value='all'>Tất cả</option>
                     <option value={ApplicationStatus.SUBMITTED}>Đã nộp</option>
                     <option value={ApplicationStatus.REVIEWED}>Đã xem</option>
                     <option value={ApplicationStatus.INTERVIEW}>Phỏng vấn</option>
                     <option value={ApplicationStatus.OFFERED}>Đã nhận offer</option>
                     <option value={ApplicationStatus.REJECTED}>Bị từ chối</option>
                  </select>
               </div>
            </div>

            {/* Stats */}
            {!loading && paginationData && (
               <div className='mb-4 text-sm text-gray-600'>
                  Tìm thấy <span className='font-semibold'>{filteredApplications.length}</span> đơn ứng
                  tuyển
                  {paginationData.totalElements !== filteredApplications.length && (
                     <span> (trên tổng {paginationData.totalElements} đơn)</span>
                  )}
               </div>
            )}

            {/* Loading */}
            {loading && (
               <div className='flex min-h-[400px] items-center justify-center'>
                  <Loader2 className='h-8 w-8 animate-spin text-primary' />
               </div>
            )}

            {/* Empty state */}
            {!loading && filteredApplications.length === 0 && (
               <div className='flex min-h-[400px] flex-col items-center justify-center rounded-lg border bg-white p-8'>
                  <Briefcase className='mb-4 h-16 w-16 text-gray-300' />
                  <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                     {search || statusFilter !== 'all'
                        ? 'Không tìm thấy đơn ứng tuyển nào'
                        : 'Chưa có đơn ứng tuyển nào'}
                  </h3>
                  <p className='mb-6 text-center text-sm text-gray-600'>
                     {search || statusFilter !== 'all'
                        ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                        : 'Hãy bắt đầu tìm kiếm và ứng tuyển vào các công việc phù hợp'}
                  </p>
                  {!search && statusFilter === 'all' && (
                     <Link href='/search'>
                        <Button>Tìm việc làm</Button>
                     </Link>
                  )}
               </div>
            )}

            {/* Applications list */}
            {!loading && filteredApplications.length > 0 && (
               <div className='space-y-4'>
                  {filteredApplications.map((application) => (
                     <div
                        key={application.id}
                        className='overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md'
                     >
                        <div className='p-6'>
                           {/* Header */}
                           <div className='mb-4 flex items-start justify-between gap-4'>
                              <div className='flex-1'>
                                 <Link
                                    href={`/job/${application.jobResponse.id}/detail`}
                                    className='group mb-2 block'
                                 >
                                    <h3 className='text-lg font-semibold text-gray-900 group-hover:text-primary'>
                                       {application.jobResponse.title}
                                    </h3>
                                 </Link>
                                 <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600'>
                                    <div className='flex items-center gap-1'>
                                       <Building2 size={16} className='text-gray-400' />
                                       <span>{application.company.name}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                       <MapPin size={16} className='text-gray-400' />
                                       <span>{application.jobResponse.location}</span>
                                    </div>
                                 </div>
                              </div>
                              <Badge
                                 className={`whitespace-nowrap border ${STATUS_COLORS[application.status]}`}
                                 variant='outline'
                              >
                                 {STATUS_LABELS[application.status]}
                              </Badge>
                           </div>

                           {/* Details */}
                           <div className='mb-4 grid gap-3 border-t pt-4 sm:grid-cols-3'>
                              <div className='flex items-center gap-2 text-sm'>
                                 <Wallet size={16} className='text-gray-400' />
                                 <span className='text-gray-700'>
                                    {formatSalary(
                                       application.jobResponse.salaryMin,
                                       application.jobResponse.salaryMax,
                                       application.jobResponse.currency
                                    )}
                                 </span>
                              </div>
                              <div className='flex items-center gap-2 text-sm'>
                                 <Clock size={16} className='text-gray-400' />
                                 <span className='text-gray-700'>
                                    {getWorkModeLabel(application.jobResponse.workMode)}
                                 </span>
                              </div>
                              <div className='flex items-center gap-2 text-sm'>
                                 <Calendar size={16} className='text-gray-400' />
                                 <span className='text-gray-700'>
                                    Nộp: {formatDate(application.appliedAt)}
                                 </span>
                              </div>
                           </div>

                           {/* CV info */}
                           {application.resource && (
                              <div className='mb-4 rounded-md border border-gray-200 bg-gray-50 p-3'>
                                 <div className='flex items-center justify-between gap-3'>
                                    <div className='flex items-center gap-2'>
                                       <FileText size={14} className='text-gray-400' />
                                       <div>
                                          <div className='text-xs font-semibold text-gray-700'>CV đã nộp</div>
                                          <p className='text-sm text-gray-600'>
                                             {application.resource.name || 'CV.pdf'}
                                          </p>
                                       </div>
                                    </div>
                                    <Button
                                       variant='ghost'
                                       onClick={() => handleDownloadCV(application.resource, application.id)}
                                       disabled={downloadingId === application.id}
                                       className='h-7 shrink-0 px-2 text-xs hover:bg-gray-200'
                                    >
                                       {downloadingId === application.id ? (
                                          <Loader2 size={14} className='animate-spin' />
                                       ) : (
                                          <Download size={14} />
                                       )}
                                       <span className='ml-1'>Tải xuống</span>
                                    </Button>
                                 </div>
                              </div>
                           )}

                           {/* Actions */}
                           <div className='flex items-center gap-3'>
                              <Link href={`/job/${application.jobResponse.id}/detail`}>
                                 <Button variant='outline' className='text-sm'>
                                    Xem công việc
                                 </Button>
                              </Link>
                              {application.resource && (
                                 <div className='flex items-center gap-1 text-xs text-gray-500'>
                                    <FileText size={14} />
                                    <span>CV đã nộp</span>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {/* Pagination */}
            {!loading && filteredApplications.length > 0 && paginationData && paginationData.totalPages > 1 && (
               <div className='mt-6 flex justify-center'>
                  <Pagination
                     onPrev={() => setPage((p) => Math.max(1, p - 1))}
                     onNext={() => setPage((p) => Math.min(paginationData.totalPages, p + 1))}
                     disabledPrev={!paginationData.hasPrevious}
                     disabledNext={!paginationData.hasNext}
                  >
                     <span className='text-sm text-gray-600'>
                        Trang {page} / {paginationData.totalPages}
                     </span>
                  </Pagination>
               </div>
            )}
         </div>
      </div>
   )
}
