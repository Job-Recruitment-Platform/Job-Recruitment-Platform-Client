'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobService } from '@/services/job.service'
import { ModerateAction, JobResponse, JobDetail, JobStatus } from '@/types/job.type'
import {
   Briefcase,
   Building2,
   MapPin,
   DollarSign,
   Calendar,
   Users,
   Clock,
   Loader2,
   CheckCircle,
   XCircle,
   Eye
} from 'lucide-react'
import Button from '@/components/shared/Button'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

export default function VerifyJobsPage() {
   const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
   const [showDetailDialog, setShowDetailDialog] = useState(false)
   const [currentPage, setCurrentPage] = useState(1)
   const queryClient = useQueryClient()

   // Fetch all jobs with pagination
   const { data: jobsData, isLoading } = useQuery({
      queryKey: ['admin-all-jobs', currentPage],
      queryFn: () => jobService.getAllJobs(currentPage - 1, 10, 'datePosted', 'desc'), // ✅ Convert to 0-based
      refetchOnWindowFocus: false
   })

   // Fetch job detail
   const { data: jobDetail, isLoading: isLoadingDetail } = useQuery({
      queryKey: ['job-detail', selectedJobId],
      queryFn: () => jobService.getJobDetail(selectedJobId!),
      enabled: !!selectedJobId && showDetailDialog,
      refetchOnWindowFocus: false
   })

   // Moderate job mutation
   const moderateMutation = useMutation({
      mutationFn: ({ jobId, action }: { jobId: number; action: ModerateAction }) =>
         jobService.moderateJobPosting(jobId, action),
      onSuccess: (data, variables) => {
         showSuccessToast(
            variables.action === ModerateAction.APPROVE
               ? 'Đã phê duyệt tin tuyển dụng'
               : 'Đã từ chối tin tuyển dụng'
         )
         queryClient.invalidateQueries({ queryKey: ['admin-all-jobs'] })
         setShowDetailDialog(false)
      },
      onError: (error: any) => {
         showErrorToast(error.message || 'Có lỗi xảy ra')
      }
   })

   const handleViewDetail = (jobId: number) => {
      setSelectedJobId(jobId)
      setShowDetailDialog(true)
   }

   const handleModerate = (action: ModerateAction) => {
      if (!selectedJobId) return
      moderateMutation.mutate({ jobId: selectedJobId, action })
   }

   const jobs = jobsData?.content || []
   const totalPages = jobsData?.totalPages || 0

   if (isLoading) {
      return (
         <div className='flex h-96 items-center justify-center'>
            <Loader2 className='text-primary h-8 w-8 animate-spin' />
         </div>
      )
   }

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div>
               <h1 className='text-2xl font-semibold text-gray-900'>Quản lý tin tuyển dụng</h1>
               <p className='mt-1 text-sm text-gray-500'>
                  Xem xét và phê duyệt tin tuyển dụng từ nhà tuyển dụng
               </p>
            </div>
            <div className='rounded-lg bg-blue-50 px-4 py-2'>
               <span className='text-sm font-medium text-blue-700'>
                  {jobs.length} tin tuyển dụng
               </span>
            </div>
         </div>

         {/* Jobs List */}
         {jobs.length === 0 ? (
            <div className='rounded-lg border border-gray-200 bg-white p-12 text-center'>
               <Briefcase className='mx-auto h-12 w-12 text-gray-400' />
               <h3 className='mt-4 text-lg font-medium text-gray-900'>Không có tin tuyển dụng</h3>
               <p className='mt-2 text-sm text-gray-500'>Chưa có tin tuyển dụng nào cần xem xét</p>
            </div>
         ) : (
            <div className='space-y-4'>
               {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onViewDetail={handleViewDetail} />
               ))}
            </div>
         )}

         {/* Pagination */}
         {totalPages > 1 && (
            <div className='flex items-center justify-center gap-2'>
               <Button
                  variant='outline'
                  disabled={currentPage === 1} // ✅ Check against 1
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} // ✅ Min is 1
               >
                  Trước
               </Button>
               <span className='text-sm text-gray-600'>
                  Trang {currentPage} / {totalPages} {/* ✅ Display as-is */}
               </span>
               <Button
                  variant='outline'
                  disabled={currentPage >= totalPages} // ✅ Check against totalPages
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} // ✅ Max is totalPages
               >
                  Sau
               </Button>
            </div>
         )}

         {/* Job Detail Dialog */}
         {showDetailDialog && (
            <JobDetailDialog
               job={jobDetail}
               isLoading={isLoadingDetail}
               isProcessing={moderateMutation.isPending}
               onClose={() => setShowDetailDialog(false)}
               onApprove={() => handleModerate(ModerateAction.APPROVE)}
               onReject={() => handleModerate(ModerateAction.REJECT)}
            />
         )}
      </div>
   )
}

// Job Card Component
function JobCard({ job, onViewDetail }: { job: JobResponse; onViewDetail: (id: number) => void }) {
   const getStatusColor = (status: string) => {
      switch (status) {
         case 'PENDING':
            return 'bg-amber-100 text-amber-700 border-amber-200'
         case 'PUBLISHED':
            return 'bg-green-100 text-green-700 border-green-200'
         case 'EXPIRED':
            return 'bg-gray-100 text-gray-700 border-gray-200'
         case 'CANCELED':
            return 'bg-red-100 text-red-700 border-red-200'
         default:
            return 'bg-gray-100 text-gray-700 border-gray-200'
      }
   }

   return (
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'>
         <div className='flex items-start justify-between'>
            <div className='flex-1'>
               {/* Job Title & Company */}
               <div className='flex items-start gap-3'>
                  <div className='rounded-lg bg-blue-50 p-2'>
                     <Briefcase className='h-5 w-5 text-blue-600' />
                  </div>
                  <div className='flex-1'>
                     <h3 className='text-lg font-semibold text-gray-900'>{job.title}</h3>
                     <div className='mt-1 flex items-center gap-2 text-sm text-gray-600'>
                        <Building2 size={16} />
                        {job.company}
                     </div>
                  </div>
               </div>

               {/* Job Details */}
               <div className='mt-4 grid grid-cols-2 gap-3 md:grid-cols-4'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                     <MapPin size={16} className='text-gray-400' />
                     {job.location}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                     <DollarSign size={16} className='text-gray-400' />
                     {job.salaryMin && job.salaryMax
                        ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.currency}`
                        : 'Thỏa thuận'}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                     <Clock size={16} className='text-gray-400' />
                     {job.seniority}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                     <Calendar size={16} className='text-gray-400' />
                     {new Date(job.datePosted).toLocaleDateString('vi-VN')}
                  </div>
               </div>

               {/* Skills */}
               {job.skills && job.skills.length > 0 && (
                  <div className='mt-3 flex flex-wrap gap-2'>
                     {job.skills.slice(0, 5).map((skill) => (
                        <span
                           key={skill.id}
                           className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                        >
                           {skill.name}
                        </span>
                     ))}
                     {job.skills.length > 5 && (
                        <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'>
                           +{job.skills.length - 5}
                        </span>
                     )}
                  </div>
               )}
            </div>

            {/* Status & Actions */}
            <div className='ml-4 flex flex-col items-end gap-3'>
               <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(job.status)}`}
               >
                  {job.status}
               </span>
               <Button variant='outline' onClick={() => onViewDetail(job.id)} className='gap-2'>
                  <Eye size={16} />
                  Chi tiết
               </Button>
            </div>
         </div>
      </div>
   )
}

// Job Detail Dialog Component
function JobDetailDialog({
   job,
   isLoading,
   isProcessing,
   onClose,
   onApprove,
   onReject
}: {
   job?: JobDetail
   isLoading: boolean
   isProcessing: boolean
   onClose: () => void
   onApprove: () => void
   onReject: () => void
}) {
   if (isLoading) {
      return (
         <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='rounded-lg bg-white p-8'>
               <Loader2 className='text-primary h-8 w-8 animate-spin' />
            </div>
         </div>
      )
   }

   if (!job) return null

   return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
         <div className='max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white'>
            {/* Header */}
            <div className='sticky top-0 border-b bg-white p-6'>
               <div className='flex items-start justify-between'>
                  <div>
                     <h2 className='text-2xl font-semibold text-gray-900'>{job.title}</h2>
                     <p className='mt-1 text-gray-600'>{job.company}</p>
                  </div>
                  <button
                     onClick={onClose}
                     className='rounded-lg p-2 hover:bg-gray-100'
                     disabled={isProcessing}
                  >
                     <XCircle size={24} />
                  </button>
               </div>
            </div>

            {/* Content */}
            <div className='space-y-6 p-6'>
               {/* Basic Info */}
               <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  <InfoItem icon={MapPin} label='Địa điểm' value={job.location} />
                  <InfoItem icon={Clock} label='Cấp bậc' value={job.seniority} />
                  <InfoItem
                     icon={Users}
                     label='Kinh nghiệm'
                     value={`${job.minExperienceYears} năm`}
                  />
                  <InfoItem icon={Briefcase} label='Hình thức' value={job.workMode} />
               </div>

               {/* Salary */}
               <div className='rounded-lg bg-green-50 p-4'>
                  <div className='flex items-center gap-2 text-green-700'>
                     <DollarSign size={20} />
                     <span className='font-semibold'>Mức lương</span>
                  </div>
                  <p className='mt-2 text-lg font-bold text-green-900'>
                     {job.salaryMin && job.salaryMax
                        ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.currency}`
                        : 'Thỏa thuận'}
                  </p>
               </div>

               {/* Skills */}
               {job.skills && job.skills.length > 0 && (
                  <div>
                     <h3 className='mb-3 font-semibold text-gray-900'>Kỹ năng yêu cầu</h3>
                     <div className='flex flex-wrap gap-2'>
                        {job.skills.map((skill) => (
                           <span
                              key={skill.id}
                              className='rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700'
                           >
                              {skill.name}
                           </span>
                        ))}
                     </div>
                  </div>
               )}

               {/* Detailed Sections */}
               <DetailSection title='Mô tả công việc' content={job.summary} />
               <DetailSection title='Trách nhiệm' content={job.responsibilities} />
               <DetailSection title='Yêu cầu' content={job.requirements} />
               {job.niceToHave && <DetailSection title='Ưu tiên' content={job.niceToHave} />}
               {job.benefits && <DetailSection title='Quyền lợi' content={job.benefits} />}
               {job.hiringProcess && (
                  <DetailSection title='Quy trình tuyển dụng' content={job.hiringProcess} />
               )}
            </div>

            {/* Actions */}
            {job.status === JobStatus.PENDING && (
               <div className='sticky bottom-0 border-t bg-gray-50 p-6'>
                  <div className='flex items-center gap-3'>
                     <Button
                        variant='outline'
                        onClick={onReject}
                        disabled={isProcessing}
                        className='flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50'
                     >
                        <XCircle size={18} />
                        Từ chối
                     </Button>
                     <Button
                        variant='primary'
                        onClick={onApprove}
                        disabled={isProcessing}
                        className='flex-1 gap-2'
                     >
                        {isProcessing ? (
                           <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                           <CheckCircle size={18} />
                        )}
                        Phê duyệt
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
   return (
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-3'>
         <div className='flex items-center gap-2 text-xs text-gray-500'>
            <Icon size={14} />
            {label}
         </div>
         <p className='mt-1 font-medium text-gray-900'>{value}</p>
      </div>
   )
}

function DetailSection({ title, content }: { title: string; content: string }) {
   return (
      <div>
         <h3 className='mb-3 font-semibold text-gray-900'>{title}</h3>
         <div
            className='prose prose-sm max-w-none text-gray-600'
            dangerouslySetInnerHTML={{ __html: content }}
         />
      </div>
   )
}
