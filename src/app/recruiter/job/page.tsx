'use client'
import { Briefcase, Eye, EyeOff, Pencil, PlusCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import Button from '@/components/shared/Button'
import Pagination from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobService } from '@/services/job.service'
import { JobStatus } from '@/types/job.type'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { useRouter } from 'next/navigation'

export default function RecruiterJobsPage() {
   const router = useRouter()
   const queryClient = useQueryClient()
   const [page, setPage] = useState(1)
   const [search, setSearch] = useState('')
   const [status, setStatus] = useState<JobStatus | 'all'>('all')
   const pageSize = 10

   // Fetch all jobs based on status
   const { data: publishedJobs, isLoading: publishedLoading } = useQuery({
      queryKey: ['recruiter-jobs', JobStatus.PUBLISHED],
      queryFn: () => jobService.getCompanyJobs(JobStatus.PUBLISHED),
      refetchOnWindowFocus: false
   })

   const { data: draftJobs, isLoading: draftLoading } = useQuery({
      queryKey: ['recruiter-jobs', JobStatus.DRAFT],
      queryFn: () => jobService.getCompanyJobs(JobStatus.DRAFT),
      refetchOnWindowFocus: false
   })

   const { data: pendingJobs, isLoading: pendingLoading } = useQuery({
      queryKey: ['recruiter-jobs', JobStatus.PENDING],
      queryFn: () => jobService.getCompanyJobs(JobStatus.PENDING),
      refetchOnWindowFocus: false
   })

   const { data: canceledJobs, isLoading: canceledLoading } = useQuery({
      queryKey: ['recruiter-jobs', JobStatus.CANCELED],
      queryFn: () => jobService.getCompanyJobs(JobStatus.CANCELED),
      refetchOnWindowFocus: false
   })

   const { data: expiredJobs, isLoading: expiredLoading } = useQuery({
      queryKey: ['recruiter-jobs', JobStatus.EXPIRED],
      queryFn: () => jobService.getCompanyJobs(JobStatus.EXPIRED),
      refetchOnWindowFocus: false
   })

   const allJobs = useMemo(() => {
      const publishedContent = publishedJobs?.content || []
      const draftContent = draftJobs?.content || []
      const pendingContent = pendingJobs?.content || []
      const canceledContent = canceledJobs?.content || []
      const expiredContent = expiredJobs?.content || []

      const mapWithCreatedAt = (arr: any[]) => Array.isArray(arr)
         ? arr.map(job => ({ ...job, createdAt: job.datePosted }))
         : []

      const published = mapWithCreatedAt(publishedContent)
      const drafts = mapWithCreatedAt(draftContent)
      const pendings = mapWithCreatedAt(pendingContent)
      const canceled = mapWithCreatedAt(canceledContent)
      const expired = mapWithCreatedAt(expiredContent)

      return [...published, ...pendings, ...drafts, ...canceled, ...expired]
   }, [publishedJobs, draftJobs, pendingJobs, canceledJobs, expiredJobs])

   const isLoading = publishedLoading || draftLoading || pendingLoading || canceledLoading || expiredLoading

   const filtered = useMemo(() => {
      return allJobs.filter((j) => {
         const matchStatus = status === 'all' 
            ? true 
            : status === JobStatus.PUBLISHED 
               ? j.status === 'PUBLISHED'
               : status === JobStatus.DRAFT
                  ? j.status === 'DRAFT'
                  : j.status === status
         const matchSearch = j.title.toLowerCase().includes(search.toLowerCase().trim())
         return matchStatus && matchSearch
      })
   }, [allJobs, search, status])

   // Cancel job mutation
   const cancelMutation = useMutation({
      mutationFn: (jobId: number) => jobService.cancelJob(jobId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] })
         showSuccessToast('Hủy tin tuyển dụng thành công')
      },
      onError: () => {
         showErrorToast('Không thể hủy tin tuyển dụng')
      }
   })

   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
   const jobs = useMemo(() => {
      const start = (page - 1) * pageSize
      return filtered.slice(start, start + pageSize)
   }, [filtered, page])

   const statusCounts = useMemo(() => {
      const all = allJobs.length
      const published = allJobs.filter(j => j.status === 'PUBLISHED').length
      const pending = allJobs.filter(j => j.status === 'PENDING').length
      const draft = allJobs.filter(j => j.status === 'DRAFT').length
      const canceled = allJobs.filter(j => j.status === 'CANCELED').length
      const expired = allJobs.filter(j => j.status === 'EXPIRED').length
      return { all, published, pending, draft, canceled, expired }
   }, [allJobs])

   if (isLoading) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
         </div>
      )
   }

   return (
      <div className='space-y-6'>
         <div className='space-y-3'>
            <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
               <div>
                  <div className='text-xl font-semibold'>Quản lý tin tuyển dụng</div>
                  <div className='text-sm text-gray-500'>Xem và quản lý các tin tuyển dụng của bạn</div>
               </div>
               <Link
                  href='/recruiter/job/create'
                  className='inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90'
               >
                  <PlusCircle size={16} />
                  Tạo tin mới
               </Link>
            </div>

            <div className='space-y-3'>
               <div className='w-full sm:w-80'>
                  <Input
                     placeholder='Tìm theo chức danh...'
                     value={search}
                     onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                     }}
                     aria-label='Tìm kiếm tin tuyển dụng'
                  />
               </div>
               <div className='-mx-2 overflow-x-auto pb-1'>
                  <div className='mx-2 flex items-center gap-2 whitespace-nowrap'>
                     {([
                        { key: 'all' as const, label: 'Tất cả', count: statusCounts.all },
                        { key: JobStatus.PUBLISHED, label: 'Đang hiển thị', count: statusCounts.published },
                        { key: JobStatus.PENDING, label: 'Chờ duyệt', count: statusCounts.pending },
                        { key: JobStatus.DRAFT, label: 'Bản nháp', count: statusCounts.draft },
                        { key: JobStatus.CANCELED, label: 'Đã hủy', count: statusCounts.canceled },
                        { key: JobStatus.EXPIRED, label: 'Hết hạn', count: statusCounts.expired },
                     ]).map((tab) => {
                        const isActive = status === tab.key
                        return (
                           <button
                              key={tab.key}
                              onClick={() => {
                                 setStatus(tab.key)
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

         <div className='overflow-hidden rounded-md border bg-white'>
            <div className='grid grid-cols-12 gap-2 border-b px-4 py-3 text-xs font-medium text-gray-500'>
               <div className='col-span-5'>Chức danh</div>
               <div className='col-span-2 hidden sm:block'>Ngày tạo</div>
               <div className='col-span-2 text-center'>Lượt xem</div>
               <div className='col-span-1 text-center'>Ứng viên</div>
               <div className='col-span-2 text-right'>Thao tác</div>
            </div>

            <div className='divide-y'>
               {jobs.length === 0 ? (
                  <div className='flex h-32 items-center justify-center text-sm text-gray-500'>
                     Không có tin tuyển dụng nào
                  </div>
               ) : (
                  jobs.map((job) => {
                     const isPublished = job.status === 'PUBLISHED' || job.status === 'PENDING'
                     const isDraft = job.status === 'DRAFT'
                     const isCanceled = job.status === 'CANCELED'
                     const isExpired = job.status === 'EXPIRED'
                     
                     const getStatusLabel = () => {
                        switch (job.status) {
                           case 'PUBLISHED': return 'Đang hiển thị'
                           case 'PENDING': return 'Chờ duyệt'
                           case 'DRAFT': return 'Bản nháp'
                           case 'CANCELED': return 'Đã hủy'
                           case 'EXPIRED': return 'Hết hạn'
                           default: return 'Bản nháp'
                        }
                     }
                     
                     const getStatusStyle = () => {
                        if (isPublished) return 'bg-green-100 text-green-700'
                        if (isDraft) return 'bg-gray-100 text-gray-700'
                        if (isCanceled) return 'bg-red-100 text-red-700'
                        if (isExpired) return 'bg-orange-100 text-orange-700'
                        return 'bg-gray-100 text-gray-700'
                     }
                     
                     const dateCreated = job.datePosted 
                        ? new Date(job.datePosted).toLocaleDateString('vi-VN')
                        : 'N/A'
                     
                     return (
                        <div key={job.id} className='grid grid-cols-12 items-center gap-2 px-4 py-4 text-sm'>
                           <div className='col-span-5 min-w-0'>
                              <div className='truncate font-medium'>{job.title}</div>
                              <div className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs ${getStatusStyle()}`}>
                                 {getStatusLabel()}
                              </div>
                           </div>
                           <div className='col-span-2 hidden text-gray-500 sm:block'>{dateCreated}</div>
                           <div className='col-span-2 text-center text-gray-500'>-</div>
                           <div className='col-span-1 text-center text-gray-500'>-</div>
                           <div className='col-span-2 flex items-center justify-end gap-2'>
                              <Link 
                                 href={`/job/${job.id}/detail`} 
                                 className='rounded-md border px-2 py-1 hover:bg-gray-50'
                                 title='Xem chi tiết'
                              >
                                 <Briefcase size={16} />
                              </Link>
                              <Link
                                 href={`/recruiter/job/${job.id}/edit`}
                                 className='rounded-md border px-2 py-1 hover:bg-gray-50'
                                 title='Chỉnh sửa'
                              >
                                 <Pencil size={16} />
                              </Link>
                              {(isPublished || job.status === 'PUBLISHED') && !isCanceled && (
                                 <button 
                                    onClick={() => cancelMutation.mutate(job.id)}
                                    disabled={cancelMutation.isPending}
                                    className='rounded-md border px-2 py-1 hover:bg-gray-50 disabled:opacity-50'
                                    title='Hủy tin'
                                 >
                                    <EyeOff size={16} />
                                 </button>
                              )}
                           </div>
                        </div>
                     )
                  })
               )}
            </div>
         </div>

         <div className='flex items-center justify-between'>
            <div className='text-xs text-gray-500'>
               Hiển thị {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} trong số {filtered.length}
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
      </div>
   )
}


