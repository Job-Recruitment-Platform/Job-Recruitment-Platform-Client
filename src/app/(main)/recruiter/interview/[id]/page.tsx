'use client'

import { ArrowLeft, Download, FileText, Mail, Phone, User, Loader2, Calendar, MapPin, Clock, Edit, Save, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { recruiterService } from '@/services/recruiter.service'
import { companyService } from '@/services/company.service'
import { jobService } from '@/services/job.service'
import { resourceService } from '@/services/resource.service'
import Button from '@/components/shared/Button'
import { InterviewResponse, InterviewStatus, UpdateInterviewRequest } from '@/types/interview.type'
import { ResourceType } from '@/types/resource.type'
import { JobApplicantResponse, JobStatus } from '@/types/job.type'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState, useMemo } from 'react'

export default function InterviewDetailPage() {
   const router = useRouter()
   const params = useParams()
   const queryClient = useQueryClient()
   const interviewId = Number(params.id)

   const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null)
   const [cvPreviewType, setCvPreviewType] = useState<'pdf' | 'latex' | null>(null)
   const [cvPreviewContent, setCvPreviewContent] = useState<string | null>(null)
   const [isLoadingCV, setIsLoadingCV] = useState(false)
   
   // Update interview dialog state
   const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
   const [updateForm, setUpdateForm] = useState<{
      date: string
      time: string
      locationId: number
      status: InterviewStatus
      notes: string
   }>({
      date: '',
      time: '',
      locationId: 0,
      status: InterviewStatus.SCHEDULED,
      notes: ''
   })

   // Fetch recruiter profile to get companyId
   const { data: recruiterProfile } = useQuery({
      queryKey: ['recruiter-profile'],
      queryFn: () => recruiterService.getProfile(),
      staleTime: 5 * 60 * 1000
   })

   const companyId = recruiterProfile?.data?.company?.id

   // Fetch company profile to get company locations
   const { data: companyProfile } = useQuery({
      queryKey: ['company-profile', companyId],
      queryFn: () => companyService.getCompanyProfile(companyId as number),
      enabled: !!companyId,
      staleTime: 5 * 60 * 1000
   })

   const companyLocations = (companyProfile?.data?.companyLocations || []) as Array<any>

   // Fetch all interviews to find the specific one
   const { data: interviewsData, isLoading } = useQuery({
      queryKey: ['company-interviews'],
      queryFn: () => recruiterService.getCompanyInterviews(),
      refetchOnWindowFocus: false
   })

   const interviews = (interviewsData?.data?.content || []) as InterviewResponse[]
   const interview = interviews.find((i) => i.id === interviewId)

   // Fetch all jobs to search for applicant
   const { data: allJobsData } = useQuery({
      queryKey: ['all-company-jobs-for-applicant'],
      queryFn: async () => {
         const [published, pending, draft] = await Promise.all([
            jobService.getCompanyJobs(JobStatus.PUBLISHED).catch(() => ({ content: [] })),
            jobService.getCompanyJobs(JobStatus.PENDING).catch(() => ({ content: [] })),
            jobService.getCompanyJobs(JobStatus.DRAFT).catch(() => ({ content: [] }))
         ])
         return [
            ...(published?.content || []),
            ...(pending?.content || []),
            ...(draft?.content || [])
         ]
      },
      enabled: !!interview?.applicationId,
      staleTime: 5 * 60 * 1000
   })

   // Fetch applicants for all jobs to find the matching one
   const { data: applicantData, isLoading: isLoadingApplicant } = useQuery({
      queryKey: ['applicant-by-application-id', interview?.applicationId, allJobsData],
      queryFn: async () => {
         if (!interview?.applicationId || !allJobsData?.length) return null

         // Search through all jobs' applicants
         for (const job of allJobsData) {
            try {
               const applicantsResponse = await jobService.getJobApplicants(job.id)
               const applicant = (applicantsResponse?.content || []).find(
                  (app: JobApplicantResponse) => app.id === interview.applicationId
               )
               if (applicant) {
                  return { applicant, jobId: job.id }
               }
            } catch (error) {
               console.error(`Error fetching applicants for job ${job.id}:`, error)
               continue
            }
         }
         return null
      },
      enabled: !!interview?.applicationId && !!allJobsData?.length,
      staleTime: 5 * 60 * 1000
   })

   const applicant = applicantData?.applicant
   const jobId = applicantData?.jobId

   // Update interview mutation
   const updateInterviewMutation = useMutation({
      mutationFn: (data: UpdateInterviewRequest) => recruiterService.updateInterview(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['company-interviews'] })
         showSuccessToast('Cập nhật phỏng vấn thành công')
         setIsUpdateDialogOpen(false)
      },
      onError: () => {
         showErrorToast('Không thể cập nhật phỏng vấn')
      }
   })

   // Load CV preview
   const handlePreviewCV = async (cvResource: any) => {
      try {
         setIsLoadingCV(true)
         const arrayBuffer = await resourceService.downloadResource(cvResource.url)
         if (arrayBuffer) {
            const mimeType = (cvResource.mimeType || '').toLowerCase()
            const fileName = (cvResource.name || '').toLowerCase()
            
            const hasPdfExtension = fileName.endsWith('.pdf')
            const hasPdfMimeType = mimeType === 'application/pdf' || mimeType.includes('/pdf')
            
            if (hasPdfExtension || hasPdfMimeType) {
               const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
               const url = window.URL.createObjectURL(blob)
               setCvPreviewUrl(url)
               setCvPreviewType('pdf')
               setCvPreviewContent(null)
               return
            }
            
            const hasTextExtension = fileName.endsWith('.tex') || 
                                    fileName.endsWith('.latex') || 
                                    fileName.endsWith('.txt')
            
            const hasTextMimeType = mimeType.startsWith('text/') || 
                                   mimeType === 'application/x-tex' ||
                                   mimeType === 'text/x-latex'
            
            if (hasTextExtension && hasTextMimeType) {
               try {
                  const textDecoder = new TextDecoder('utf-8')
                  const textContent = textDecoder.decode(arrayBuffer)
                  setCvPreviewContent(textContent)
                  setCvPreviewType('latex')
                  setCvPreviewUrl(null)
                  return
               } catch {
                  // Fall through
               }
            }
            
            const blobType = mimeType || 'application/pdf'
            const blob = new Blob([arrayBuffer], { type: blobType })
            const url = window.URL.createObjectURL(blob)
            setCvPreviewUrl(url)
            setCvPreviewType('pdf')
            setCvPreviewContent(null)
         }
      } catch (error) {
         console.error('Error loading CV preview:', error)
         showErrorToast('Không thể tải CV để xem trước')
      } finally {
         setIsLoadingCV(false)
      }
   }

   // Download CV handler
   const handleDownloadCV = async (cvResource: any) => {
      try {
         setIsLoadingCV(true)
         const arrayBuffer = await resourceService.downloadResource(cvResource.url)
         if (arrayBuffer) {
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
         setIsLoadingCV(false)
      }
   }

   // Close preview
   const handleClosePreview = () => {
      if (cvPreviewUrl) {
         window.URL.revokeObjectURL(cvPreviewUrl)
      }
      setCvPreviewUrl(null)
      setCvPreviewType(null)
      setCvPreviewContent(null)
   }

   // Initialize update form when dialog opens
   const handleOpenUpdateDialog = () => {
      if (!interview) return
      
      const scheduledDate = new Date(interview.scheduledAt)
      const dateStr = scheduledDate.toISOString().split('T')[0]
      const timeStr = scheduledDate.toTimeString().slice(0, 5)
      
      // Find matching location from company locations
      const matchingLocation = companyLocations.find(
         (cl: any) => cl.location?.id === (interview.location as any)?.id
      )
      
      setUpdateForm({
         date: dateStr,
         time: timeStr,
         locationId: matchingLocation?.location?.id || (interview.location as any)?.id || 0,
         status: interview.status,
         notes: interview.notes || ''
      })
      setIsUpdateDialogOpen(true)
   }

   // Handle update interview
   const handleUpdateInterview = () => {
      if (!interview) return
      
      if (!updateForm.date || !updateForm.time || !updateForm.locationId) {
         showErrorToast('Vui lòng điền đầy đủ thông tin')
         return
      }

      const scheduledDateTime = new Date(`${updateForm.date}T${updateForm.time}`).toISOString()

      const updateData: UpdateInterviewRequest = {
         interviewId: interview.id,
         scheduledAt: scheduledDateTime,
         locationId: updateForm.locationId,
         status: updateForm.status,
         notes: updateForm.notes || undefined
      }

      updateInterviewMutation.mutate(updateData)
   }

   // Format date and time
   const formatDateTime = (dateString: string): { date: string; time: string } => {
      const date = new Date(dateString)
      const dateStr = date.toLocaleDateString('vi-VN', {
         weekday: 'long',
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

   if (!interview) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <div className='text-center'>
               <p className='text-gray-500'>Không tìm thấy thông tin phỏng vấn</p>
               <Button variant='outline' className='mt-4' onClick={() => router.back()}>
                  Quay lại
               </Button>
            </div>
         </div>
      )
   }

   const { date, time } = formatDateTime(interview.scheduledAt)
   const locationStr = formatLocation(interview.location)

   const cvResources = applicant?.resource?.filter((res) => res.resourceType === ResourceType.CV) || []
   const avatarResource = applicant?.resource?.find((res) => res.resourceType === ResourceType.AVATAR)

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
               <Link
                  href='/recruiter/interview'
                  className='text-gray-500 hover:text-gray-700'
                  title='Quay lại danh sách phỏng vấn'
               >
                  <ArrowLeft size={20} />
               </Link>
               <div>
                  <h1 className='text-2xl font-semibold'>{interview.candidateName}</h1>
                  <p className='text-sm text-gray-500'>
                     Phỏng vấn cho: <span className='font-medium'>{interview.jobTitle}</span>
                  </p>
               </div>
            </div>
            <div className='flex items-center gap-3'>
               <Button
                  variant='primary'
                  onClick={handleOpenUpdateDialog}
                  disabled={updateInterviewMutation.isPending}
               >
                  <Edit size={16} className='mr-2' />
                  Cập nhật phỏng vấn
               </Button>
            </div>
         </div>

         <div className='grid gap-6 lg:grid-cols-3'>
            {/* Left Column - Candidate Info */}
            <div className='lg:col-span-1 space-y-6'>
               <div className='rounded-lg border bg-white p-6'>
                  <div className='mb-6 flex flex-col items-center text-center'>
                     {avatarResource ? (
                        <img
                           src={avatarResource.url}
                           alt={interview.candidateName}
                           className='mb-4 h-24 w-24 rounded-full object-cover'
                        />
                     ) : (
                        <div className='mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10'>
                           <User size={40} className='text-primary' />
                        </div>
                     )}
                     <h2 className='text-xl font-semibold'>{interview.candidateName}</h2>
                     <div className='mt-2'>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(interview.status)}`}>
                           {getStatusLabel(interview.status)}
                        </span>
                     </div>
                  </div>

                  <div className='space-y-4 border-t pt-4'>
                     {applicant?.email && (
                        <div className='flex items-start gap-3'>
                           <Mail size={18} className='mt-0.5 text-gray-400' />
                           <div>
                              <div className='text-xs text-gray-500'>Email</div>
                              <div className='text-sm font-medium'>{applicant.email}</div>
                           </div>
                        </div>
                     )}
                     {applicant?.phone && (
                        <div className='flex items-start gap-3'>
                           <Phone size={18} className='mt-0.5 text-gray-400' />
                           <div>
                              <div className='text-xs text-gray-500'>Số điện thoại</div>
                              <div className='text-sm font-medium'>{applicant.phone}</div>
                           </div>
                        </div>
                     )}
                     <div className='flex items-start gap-3'>
                        <Briefcase size={18} className='mt-0.5 text-gray-400' />
                        <div>
                           <div className='text-xs text-gray-500'>Vị trí ứng tuyển</div>
                           <div className='text-sm font-medium'>{interview.jobTitle}</div>
                        </div>
                     </div>
                     <div className='flex items-start gap-3'>
                        <Calendar size={18} className='mt-0.5 text-gray-400' />
                        <div>
                           <div className='text-xs text-gray-500'>Ngày phỏng vấn</div>
                           <div className='text-sm font-medium'>{date}</div>
                        </div>
                     </div>
                     <div className='flex items-start gap-3'>
                        <Clock size={18} className='mt-0.5 text-gray-400' />
                        <div>
                           <div className='text-xs text-gray-500'>Giờ phỏng vấn</div>
                           <div className='text-sm font-medium'>{time}</div>
                        </div>
                     </div>
                     <div className='flex items-start gap-3'>
                        <MapPin size={18} className='mt-0.5 text-gray-400' />
                        <div>
                           <div className='text-xs text-gray-500'>Địa điểm</div>
                           <div className='text-sm font-medium'>{locationStr}</div>
                        </div>
                     </div>
                     {interview.notes && (
                        <div className='rounded-md bg-gray-50 p-3'>
                           <div className='mb-1 text-xs font-medium text-gray-500'>Ghi chú</div>
                           <div className='text-sm text-gray-700'>{interview.notes}</div>
                        </div>
                     )}
                  </div>
               </div>

               {/* CV Files */}
               {cvResources.length > 0 && (
                  <div className='rounded-lg border bg-white p-6'>
                     <h3 className='mb-4 text-sm font-semibold'>Hồ sơ ứng tuyển</h3>
                     <div className='space-y-2'>
                        {cvResources.map((cv) => (
                           <div
                              key={cv.id}
                              className='flex items-center justify-between rounded-md border p-3'
                           >
                              <div className='flex items-center gap-2'>
                                 <FileText size={16} className='text-gray-400' />
                                 <span className='text-sm font-medium'>{cv.name || 'CV'}</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                 <Button
                                    variant='ghost'
                                    onClick={() => handlePreviewCV(cv)}
                                    disabled={isLoadingCV}
                                    className='h-8 px-2 text-xs'
                                 >
                                    Xem
                                 </Button>
                                 <Button
                                    variant='ghost'
                                    onClick={() => handleDownloadCV(cv)}
                                    disabled={isLoadingCV}
                                    className='h-8 px-2'
                                 >
                                    <Download size={14} />
                                 </Button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>

            {/* Right Column - CV Preview */}
            <div className='lg:col-span-2'>
               <div className='rounded-lg border bg-white p-6'>
                  <div className='mb-4 flex items-center justify-between'>
                     <h3 className='text-lg font-semibold'>Xem trước CV</h3>
                     {(cvPreviewUrl || cvPreviewContent) && (
                        <Button
                           variant='ghost'
                           onClick={handleClosePreview}
                           className='text-xs'
                        >
                           Đóng
                        </Button>
                     )}
                  </div>
                  <div className='min-h-[600px]'>
                     {isLoadingApplicant ? (
                        <div className='flex h-[600px] items-center justify-center'>
                           <Loader2 className='h-8 w-8 animate-spin text-primary' />
                        </div>
                     ) : isLoadingCV ? (
                        <div className='flex h-[600px] items-center justify-center'>
                           <Loader2 className='h-8 w-8 animate-spin text-primary' />
                        </div>
                     ) : cvPreviewType === 'pdf' && cvPreviewUrl ? (
                        <iframe
                           src={cvPreviewUrl}
                           className='h-[600px] w-full rounded-md border'
                           title='CV Preview'
                        />
                     ) : cvPreviewType === 'latex' && cvPreviewContent ? (
                        <div className='h-[600px] overflow-auto rounded-md border bg-gray-50 p-4'>
                           <pre className='whitespace-pre-wrap font-mono text-sm text-gray-800'>
                              {cvPreviewContent}
                           </pre>
                        </div>
                     ) : (
                        <div className='flex h-[600px] flex-col items-center justify-center text-center text-gray-400'>
                           <FileText size={48} className='mb-4 opacity-50' />
                           <p className='mb-2 font-medium'>Chưa có CV để xem trước</p>
                           <p className='text-sm'>
                              {cvResources.length > 0
                                 ? 'Nhấn "Xem" để xem trước hồ sơ ứng viên'
                                 : 'Ứng viên chưa tải lên CV'}
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Update Interview Dialog */}
         <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogContent className='sm:max-w-md'>
               <DialogHeader>
                  <DialogTitle>Cập nhật phỏng vấn</DialogTitle>
                  <DialogDescription>
                     Cập nhật thông tin lịch phỏng vấn với {interview.candidateName}
                  </DialogDescription>
               </DialogHeader>
               <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                     <Label htmlFor='update-date'>
                        Ngày phỏng vấn <span className='text-red-500'>*</span>
                     </Label>
                     <Input
                        id='update-date'
                        type='date'
                        value={updateForm.date}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='update-time'>
                        Giờ phỏng vấn <span className='text-red-500'>*</span>
                     </Label>
                     <Input
                        id='update-time'
                        type='time'
                        value={updateForm.time}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, time: e.target.value }))}
                        required
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='update-location'>
                        Địa điểm <span className='text-red-500'>*</span>
                     </Label>
                     <select
                        id='update-location'
                        value={updateForm.locationId}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, locationId: Number(e.target.value) }))}
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                        required
                     >
                        <option value={0}>Chọn địa điểm</option>
                        {companyLocations.map((cl: any) => {
                           const loc = cl.location
                           const label = [
                              loc?.streetAddress,
                              loc?.ward,
                              loc?.district,
                              loc?.provinceCity,
                              loc?.country
                           ].filter(Boolean).join(', ')
                           return (
                              <option key={loc.id} value={loc.id}>
                                 {label} {cl.isHeadquarter ? '(Trụ sở)' : ''}
                              </option>
                           )
                        })}
                     </select>
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='update-status'>
                        Trạng thái <span className='text-red-500'>*</span>
                     </Label>
                     <select
                        id='update-status'
                        value={updateForm.status}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e.target.value as InterviewStatus }))}
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                        required
                     >
                        <option value={InterviewStatus.SCHEDULED}>Đã lên lịch</option>
                        <option value={InterviewStatus.COMPLETED}>Đã hoàn thành</option>
                        <option value={InterviewStatus.CANCELED}>Đã hủy</option>
                        <option value={InterviewStatus.NO_SHOW}>Không đến</option>
                     </select>
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='update-notes'>Ghi chú</Label>
                     <Textarea
                        id='update-notes'
                        value={updateForm.notes}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        placeholder='Nhập ghi chú (nếu có)'
                     />
                  </div>
               </div>
               <DialogFooter>
                  <Button
                     variant='outline'
                     onClick={() => setIsUpdateDialogOpen(false)}
                     disabled={updateInterviewMutation.isPending}
                  >
                     Hủy
                  </Button>
                  <Button
                     variant='primary'
                     onClick={handleUpdateInterview}
                     disabled={updateInterviewMutation.isPending || !updateForm.date || !updateForm.time || !updateForm.locationId}
                  >
                     {updateInterviewMutation.isPending ? (
                        <>
                           <Loader2 size={16} className='mr-2 animate-spin' />
                           Đang xử lý...
                        </>
                     ) : (
                        <>
                           <Save size={16} className='mr-2' />
                           Lưu thay đổi
                        </>
                     )}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   )
}

