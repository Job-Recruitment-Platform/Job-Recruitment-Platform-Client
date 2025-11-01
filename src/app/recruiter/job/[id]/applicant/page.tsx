'use client'

import { FileText, Mail, Phone, User, Loader2, Download, ArrowLeft, Search, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobService } from '@/services/job.service'
import { resourceService } from '@/services/resource.service'
import { useJob } from '@/hooks/useJob'
import { Input } from '@/components/ui/input'
import Button from '@/components/shared/Button'
import Pagination from '@/components/ui/pagination'
import { ApplicationStatus, type JobApplicantResponse } from '@/types/job.type'
import { ResourceType } from '@/types/resource.type'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

export default function JobApplicantsPage() {
   const router = useRouter()
   const params = useParams()
   const queryClient = useQueryClient()
   const jobId = Number(params.id)
   const [page, setPage] = useState(1)
   const [search, setSearch] = useState('')
   const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
   const pageSize = 10

   // Fetch job detail for title
   const { data: jobDetail } = useJob(jobId, !!jobId)

   // Fetch applicants
   const { data: applicantsData, isLoading, isError } = useQuery({
      queryKey: ['job-applicants', jobId],
      queryFn: () => jobService.getJobApplicants(jobId),
      enabled: !!jobId,
      refetchOnWindowFocus: false
   })

   // Process application mutation
   const processMutation = useMutation({
      mutationFn: ({ applicationId, action }: { applicationId: number; action: 'REVIEWED' | 'REJECTED' }) =>
         jobService.processJobApplication(applicationId, action),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ['job-applicants', jobId] })
         const message = variables.action === 'REVIEWED' ? 'Đã đánh dấu đã xem' : 'Đã từ chối ứng viên'
         showSuccessToast(message)
      },
      onError: (_, variables) => {
         const message = variables.action === 'REVIEWED' ? 'Không thể đánh dấu đã xem' : 'Không thể từ chối ứng viên'
         showErrorToast(message)
      }
   })

   // Download CV handler
   const handleDownloadCV = async (cvResource: any) => {
      try {
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
      }
   }

   const applicants = (applicantsData?.content || []) as JobApplicantResponse[]
   const totalApplicants = applicantsData?.totalElements || 0

   const filtered = useMemo(() => {
      return applicants.filter((app) => {
         const matchStatus =
            statusFilter === 'all' || app.status === statusFilter
         const searchLower = search.toLowerCase().trim()
         const matchSearch =
            !searchLower ||
            app.candidateName.toLowerCase().includes(searchLower) ||
            app.email.toLowerCase().includes(searchLower) ||
            app.phone?.toLowerCase().includes(searchLower)
         return matchStatus && matchSearch
      })
   }, [applicants, search, statusFilter])

   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
   const paginatedApplicants = useMemo(() => {
      const start = (page - 1) * pageSize
      return filtered.slice(start, start + pageSize)
   }, [filtered, page])

   const statusCounts = useMemo(() => {
      const all = applicants.length
      const submitted = applicants.filter((a) => a.status === ApplicationStatus.SUBMITTED).length
      const reviewed = applicants.filter((a) => a.status === ApplicationStatus.REVIEWED).length
      const interview = applicants.filter((a) => a.status === ApplicationStatus.INTERVIEW).length
      const offered = applicants.filter((a) => a.status === ApplicationStatus.OFFERED).length
      const rejected = applicants.filter((a) => a.status === ApplicationStatus.REJECTED).length
      return { all, submitted, reviewed, interview, offered, rejected }
   }, [applicants])

   const getStatusLabel = (status: ApplicationStatus): string => {
      switch (status) {
         case ApplicationStatus.SUBMITTED:
            return 'Đã nộp'
         case ApplicationStatus.REVIEWED:
            return 'Đã xem'
         case ApplicationStatus.INTERVIEW:
            return 'Phỏng vấn'
         case ApplicationStatus.OFFERED:
            return 'Đã offer'
         case ApplicationStatus.REJECTED:
            return 'Từ chối'
         default:
            return status
      }
   }

   const getStatusStyle = (status: ApplicationStatus): string => {
      switch (status) {
         case ApplicationStatus.SUBMITTED:
            return 'bg-blue-100 text-blue-700'
         case ApplicationStatus.REVIEWED:
            return 'bg-purple-100 text-purple-700'
         case ApplicationStatus.INTERVIEW:
            return 'bg-yellow-100 text-yellow-700'
         case ApplicationStatus.OFFERED:
            return 'bg-green-100 text-green-700'
         case ApplicationStatus.REJECTED:
            return 'bg-red-100 text-red-700'
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
               <p className='text-gray-500'>Không thể tải danh sách ứng viên</p>
               <Button
                  variant='outline'
                  className='mt-4'
                  onClick={() => router.back()}
               >
                  Quay lại
               </Button>
            </div>
         </div>
      )
   }

   return (
      <div className='space-y-6'>
         <div className='space-y-3'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
               <div>
                  <div className='mb-2 flex items-center gap-2'>
                     <Link
                        href='/recruiter/job'
                        className='text-gray-500 hover:text-gray-700'
                        title='Quay lại'
                     >
                        <ArrowLeft size={20} />
                     </Link>
                     <h1 className='text-xl font-semibold'>Danh sách ứng viên</h1>
                  </div>
                  <div className='text-sm text-gray-500'>
                     {jobDetail?.title && (
                        <>
                           Tin tuyển dụng: <span className='font-medium'>{jobDetail.title}</span>
                        </>
                     )}
                  </div>
               </div>
            </div>

            <div className='space-y-3'>
               <div className='w-full sm:w-80'>
                  <div className='relative'>
                     <Search
                        className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                        size={16}
                     />
                     <Input
                        placeholder='Tìm theo tên, email, SĐT...'
                        value={search}
                        onChange={(e) => {
                           setSearch(e.target.value)
                           setPage(1)
                        }}
                        className='pl-9'
                        aria-label='Tìm kiếm ứng viên'
                     />
                  </div>
               </div>
               <div className='-mx-2 overflow-x-auto pb-1'>
                  <div className='mx-2 flex items-center gap-2 whitespace-nowrap'>
                     {([
                        { key: 'all' as const, label: 'Tất cả', count: statusCounts.all },
                        {
                           key: ApplicationStatus.SUBMITTED,
                           label: 'Đã nộp',
                           count: statusCounts.submitted
                        },
                        {
                           key: ApplicationStatus.REVIEWED,
                           label: 'Đã xem',
                           count: statusCounts.reviewed
                        },
                        {
                           key: ApplicationStatus.INTERVIEW,
                           label: 'Phỏng vấn',
                           count: statusCounts.interview
                        },
                        {
                           key: ApplicationStatus.OFFERED,
                           label: 'Đã offer',
                           count: statusCounts.offered
                        },
                        {
                           key: ApplicationStatus.REJECTED,
                           label: 'Từ chối',
                           count: statusCounts.rejected
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

         <div className='overflow-hidden rounded-md border bg-white'>
            <div className='grid grid-cols-12 gap-2 border-b px-4 py-3 text-xs font-medium text-gray-500'>
               <div className='col-span-4'>Ứng viên</div>
               <div className='col-span-2 hidden sm:block'>Liên hệ</div>
               <div className='col-span-2 text-center'>Trạng thái</div>
               <div className='col-span-2 text-center'>CV/Hồ sơ</div>
               <div className='col-span-2 text-right'>Thao tác</div>
            </div>

            <div className='divide-y'>
               {paginatedApplicants.length === 0 ? (
                  <div className='flex h-32 items-center justify-center text-sm text-gray-500'>
                     {search || statusFilter !== 'all'
                        ? 'Không tìm thấy ứng viên phù hợp'
                        : 'Chưa có ứng viên nào nộp hồ sơ'}
                  </div>
               ) : (
                  paginatedApplicants.map((applicant) => (
                     <div
                        key={applicant.id}
                        className='grid grid-cols-12 items-center gap-2 px-4 py-4 text-sm'
                     >
                        <div className='col-span-4 min-w-0'>
                           <div className='flex items-center gap-2'>
                              {(() => {
                                 const avatarResource = applicant.resource?.find(
                                    (res) => res.resourceType === ResourceType.AVATAR
                                 )
                                 return avatarResource ? (
                                    <img
                                       src={avatarResource.url}
                                       alt={applicant.candidateName}
                                       className='h-8 w-8 rounded-full object-cover'
                                    />
                                 ) : (
                                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>
                                       <User size={16} />
                                    </div>
                                 )
                              })()}
                              <div className='min-w-0 flex-1'>
                                 <div className='truncate font-medium'>{applicant.candidateName}</div>
                                 <div className='truncate text-xs text-gray-500'>ID: {applicant.candidateId}</div>
                              </div>
                           </div>
                        </div>
                        <div className='col-span-2 hidden min-w-0 sm:block'>
                           <div className='space-y-1 text-xs'>
                              <div className='flex items-center gap-1.5 truncate text-gray-600'>
                                 <Mail size={12} />
                                 <span className='truncate'>{applicant.email}</span>
                              </div>
                              {applicant.phone && (
                                 <div className='flex items-center gap-1.5 truncate text-gray-600'>
                                    <Phone size={12} />
                                    <span className='truncate'>{applicant.phone}</span>
                                 </div>
                              )}
                           </div>
                        </div>
                        <div className='col-span-2 text-center'>
                           <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusStyle(
                                 applicant.status
                              )}`}
                           >
                              {getStatusLabel(applicant.status)}
                           </span>
                        </div>
                        <div className='col-span-2 text-center'>
                           {(() => {
                              const cvResources =
                                 applicant.resource?.filter((res) => res.resourceType === ResourceType.CV) || []
                              return cvResources.length > 0 ? (
                                 <div className='flex flex-wrap items-center justify-center gap-1'>
                                    {cvResources.map((res) => (
                                       <div
                                          key={res.id}
                                          className='inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700'
                                          title={res.name}
                                       >
                                          <FileText size={12} />
                                          <span className='truncate max-w-[120px]'>{res.name || 'CV'}</span>
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <span className='text-xs text-gray-400'>-</span>
                              )
                           })()}
                        </div>
                        <div className='col-span-2 flex items-center justify-end gap-2'>
                           {(() => {
                              const cvResources =
                                 applicant.resource?.filter((res) => res.resourceType === ResourceType.CV) || []
                              const canReview = applicant.status === ApplicationStatus.SUBMITTED
                              const canReject =
                                 applicant.status === ApplicationStatus.SUBMITTED ||
                                 applicant.status === ApplicationStatus.REVIEWED ||
                                 applicant.status === ApplicationStatus.INTERVIEW

                              return (
                                 <div className='flex items-center gap-2'>
                                    {cvResources.length > 0 && (
                                       <button
                                          onClick={() => handleDownloadCV(cvResources[0])}
                                          className='rounded-md border px-2 py-1 hover:bg-gray-50'
                                          title='Tải CV'
                                       >
                                          <Download size={16} />
                                       </button>
                                    )}
                                    {canReview && (
                                       <button
                                          onClick={() =>
                                             processMutation.mutate({
                                                applicationId: applicant.id,
                                                action: 'REVIEWED'
                                             })
                                          }
                                          disabled={processMutation.isPending}
                                          className='rounded-md border border-green-300 bg-green-50 px-2 py-1 text-green-700 hover:bg-green-100 disabled:opacity-50'
                                          title='Đánh dấu đã xem'
                                       >
                                          <Check size={16} />
                                       </button>
                                    )}
                                    {canReject && (
                                       <button
                                          onClick={() =>
                                             processMutation.mutate({
                                                applicationId: applicant.id,
                                                action: 'REJECTED'
                                             })
                                          }
                                          disabled={processMutation.isPending}
                                          className='rounded-md border border-red-300 bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100 disabled:opacity-50'
                                          title='Từ chối ứng viên'
                                       >
                                          <X size={16} />
                                       </button>
                                    )}
                                 </div>
                              )
                           })()}
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

         <div className='flex items-center justify-between'>
            <div className='text-xs text-gray-500'>
               Hiển thị {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} trong số{' '}
               {filtered.length} ứng viên
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

