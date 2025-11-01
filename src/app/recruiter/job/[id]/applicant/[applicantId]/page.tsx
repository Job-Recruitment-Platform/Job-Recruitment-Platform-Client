'use client'

import { ArrowLeft, Download, FileText, Mail, Phone, User, X, CheckCircle, Loader2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobService } from '@/services/job.service'
import { resourceService } from '@/services/resource.service'
import { recruiterService } from '@/services/recruiter.service'
import { companyService } from '@/services/company.service'
import { useJob } from '@/hooks/useJob'
import Button from '@/components/shared/Button'
import { ApplicationStatus, type JobApplicantResponse } from '@/types/job.type'
import { ResourceType } from '@/types/resource.type'
import { CreateInterviewRequest } from '@/types/interview.type'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function ApplicantDetailPage() {
   const router = useRouter()
   const params = useParams()
   const queryClient = useQueryClient()
   
   // Now we can access both params clearly
   const jobId = Number(params.id) // job ID from /job/[id]
   const applicantId = Number(params.applicantId) // applicant ID from /applicant/[applicantId]

   const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null)
   const [cvPreviewType, setCvPreviewType] = useState<'pdf' | 'latex' | null>(null)
   const [cvPreviewContent, setCvPreviewContent] = useState<string | null>(null)
   const [isLoadingCV, setIsLoadingCV] = useState(false)
   
   // Interview scheduling dialog state
   const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false)
   const [interviewForm, setInterviewForm] = useState<{ date: string; time: string; locationId: number }>({
      date: '',
      time: '',
      locationId: 0
   })

   // Fetch job detail
   const { data: jobDetail } = useJob(jobId, !!jobId)

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

   // Fetch all applicants to find the specific one
   const { data: applicantsData, isLoading } = useQuery({
      queryKey: ['job-applicants', jobId],
      queryFn: () => jobService.getJobApplicants(jobId),
      enabled: !!jobId,
      refetchOnWindowFocus: false
   })

   const applicants = (applicantsData?.content || []) as JobApplicantResponse[]
   const applicant = applicants.find((app) => app.id === applicantId)

   // Process application mutation (for REVIEWED and REJECTED only)
   const processMutation = useMutation({
      mutationFn: ({ applicationId, action }: { applicationId: number; action: ApplicationStatus.REVIEWED | ApplicationStatus.REJECTED }) =>
         jobService.processJobApplication(applicationId, action),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ['job-applicants', jobId] })
         const messages: Record<ApplicationStatus, string> = {
            [ApplicationStatus.REVIEWED]: 'Đã đánh dấu đã xem',
            [ApplicationStatus.REJECTED]: 'Đã từ chối ứng viên',
            [ApplicationStatus.SUBMITTED]: '',
            [ApplicationStatus.INTERVIEW]: '',
            [ApplicationStatus.OFFERED]: ''
         }
         showSuccessToast(messages[variables.action] || 'Thao tác thành công')
      },
      onError: (_, variables) => {
         const messages: Record<ApplicationStatus, string> = {
            [ApplicationStatus.REVIEWED]: 'Không thể đánh dấu đã xem',
            [ApplicationStatus.REJECTED]: 'Không thể từ chối ứng viên',
            [ApplicationStatus.SUBMITTED]: '',
            [ApplicationStatus.INTERVIEW]: '',
            [ApplicationStatus.OFFERED]: ''
         }
         showErrorToast(messages[variables.action] || 'Thao tác thất bại')
      }
   })

   // Schedule interview mutation
   const interviewMutation = useMutation({
      mutationFn: (data: CreateInterviewRequest) => recruiterService.interviewSchedule(data),
      onSuccess: () => {
         // Backend automatically updates application status to INTERVIEW
         queryClient.invalidateQueries({ queryKey: ['job-applicants', jobId] })
         showSuccessToast('Đã lên lịch phỏng vấn thành công')
         setIsInterviewDialogOpen(false)
         setInterviewForm({ date: '', time: '', locationId: 0 })
      },
      onError: () => {
         showErrorToast('Không thể lên lịch phỏng vấn')
      }
   })

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

   // Load CV preview
   const handlePreviewCV = async (cvResource: any) => {
      try {
         setIsLoadingCV(true)
         const arrayBuffer = await resourceService.downloadResource(cvResource.url)
         if (arrayBuffer) {
            const mimeType = (cvResource.mimeType || '').toLowerCase()
            const fileName = (cvResource.name || '').toLowerCase()
            
            // Strict detection logic:
            // 1. PDF files: .pdf extension OR application/pdf MIME type -> ALWAYS use iframe (never decode as text)
            // 2. LaTeX/Text files: (.tex, .latex, .txt) AND text-based MIME type -> decode as text
            // 3. Everything else -> default to PDF viewer (iframe)
            
            const hasPdfExtension = fileName.endsWith('.pdf')
            const hasPdfMimeType = mimeType === 'application/pdf' || mimeType.includes('/pdf')
            
            // PDF files - ALWAYS use iframe, never decode as text
            if (hasPdfExtension || hasPdfMimeType) {
               const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
               const url = window.URL.createObjectURL(blob)
               setCvPreviewUrl(url)
               setCvPreviewType('pdf')
               setCvPreviewContent(null)
               return
            }
            
            // Check for LaTeX/text files - ONLY if NOT a PDF
            const hasTextExtension = fileName.endsWith('.tex') || 
                                     fileName.endsWith('.latex') || 
                                     fileName.endsWith('.txt')
            
            const hasTextMimeType = mimeType.startsWith('text/') || 
                                   mimeType === 'application/x-tex' ||
                                   mimeType === 'text/x-latex'
            
            // LaTeX/Text files - decode as text ONLY if both extension and MIME type indicate text
            if (hasTextExtension && hasTextMimeType) {
               try {
                  const textDecoder = new TextDecoder('utf-8')
                  const textContent = textDecoder.decode(arrayBuffer)
                  setCvPreviewContent(textContent)
                  setCvPreviewType('latex')
                  setCvPreviewUrl(null)
                  return
               } catch {
                  // If decoding fails, fall through to PDF viewer
               }
            }
            
            // Default: use PDF viewer for all other files
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
   
   // Close preview
   const handleClosePreview = () => {
      if (cvPreviewUrl) {
         window.URL.revokeObjectURL(cvPreviewUrl)
      }
      setCvPreviewUrl(null)
      setCvPreviewType(null)
      setCvPreviewContent(null)
   }

   // Handle interview scheduling
   const handleScheduleInterview = () => {
      if (!applicant) return
      
      if (!interviewForm.date || !interviewForm.time || !interviewForm.locationId) {
         showErrorToast('Vui lòng điền đầy đủ thông tin lịch phỏng vấn')
         return
      }

      // Combine date and time to create ISO 8601 string
      const scheduledDateTime = new Date(`${interviewForm.date}T${interviewForm.time}`).toISOString()

      interviewMutation.mutate({
         applicationId: applicant.id,
         scheduledAt: scheduledDateTime,
         locationId: interviewForm.locationId
      })
   }

   if (isLoading) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
         </div>
      )
   }

   if (!applicant) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <div className='text-center'>
               <p className='text-gray-500'>Không tìm thấy thông tin ứng viên</p>
               <Button variant='outline' className='mt-4' onClick={() => router.back()}>
                  Quay lại
               </Button>
            </div>
         </div>
      )
   }

   const cvResources = applicant.resource?.filter((res) => res.resourceType === ResourceType.CV) || []
   const avatarResource = applicant.resource?.find((res) => res.resourceType === ResourceType.AVATAR)

   const canInviteInterview =
      applicant.status === ApplicationStatus.SUBMITTED ||
      applicant.status === ApplicationStatus.REVIEWED
   const canReject =
      applicant.status === ApplicationStatus.SUBMITTED ||
      applicant.status === ApplicationStatus.REVIEWED ||
      applicant.status === ApplicationStatus.INTERVIEW

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

   return (
      <div className='space-y-6'>
         {/* Header */}
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
               <Link
                  href={`/recruiter/job/${jobId}/applicant`}
                  className='text-gray-500 hover:text-gray-700'
                  title='Quay lại danh sách ứng viên'
               >
                  <ArrowLeft size={20} />
               </Link>
               <div>
                  <h1 className='text-2xl font-semibold'>{applicant.candidateName}</h1>
                  <p className='text-sm text-gray-500'>
                     Ứng viên cho: <span className='font-medium'>{jobDetail?.title}</span>
                  </p>
               </div>
            </div>
            <div className='flex items-center gap-3'>
               {cvResources.length > 0 && (
                  <Button
                     variant='outline'
                     onClick={() => handleDownloadCV(cvResources[0])}
                     disabled={isLoadingCV}
                  >
                     <Download size={16} className='mr-2' />
                     Tải CV
                  </Button>
               )}
               {canInviteInterview && (
                  <Button
                     variant='primary'
                     onClick={() => setIsInterviewDialogOpen(true)}
                     disabled={interviewMutation.isPending}
                  >
                     <Calendar size={16} className='mr-2' />
                     Mời phỏng vấn
                  </Button>
               )}
               {canReject && (
                  <Button
                     variant='outline'
                     onClick={() =>
                        processMutation.mutate({
                           applicationId: applicant.id,
                           action: ApplicationStatus.REJECTED
                        })
                     }
                     disabled={processMutation.isPending}
                     className='border-red-300 text-red-700 hover:bg-red-50'
                  >
                     <X size={16} className='mr-2' />
                     Từ chối
                  </Button>
               )}
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
                           alt={applicant.candidateName}
                           className='mb-4 h-24 w-24 rounded-full object-cover'
                        />
                     ) : (
                        <div className='mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10'>
                           <User size={40} className='text-primary' />
                        </div>
                     )}
                     <h2 className='text-xl font-semibold'>{applicant.candidateName}</h2>
                     <div className='mt-2'>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(applicant.status)}`}>
                           {getStatusLabel(applicant.status)}
                        </span>
                     </div>
                  </div>

                  <div className='space-y-4 border-t pt-4'>
                     <div className='flex items-start gap-3'>
                        <Mail size={18} className='mt-0.5 text-gray-400' />
                        <div>
                           <div className='text-xs text-gray-500'>Email</div>
                           <div className='text-sm font-medium'>{applicant.email}</div>
                        </div>
                     </div>
                     {applicant.phone && (
                        <div className='flex items-start gap-3'>
                           <Phone size={18} className='mt-0.5 text-gray-400' />
                           <div>
                              <div className='text-xs text-gray-500'>Số điện thoại</div>
                              <div className='text-sm font-medium'>{applicant.phone}</div>
                           </div>
                        </div>
                     )}
                     <div className='flex items-start gap-3'>
                        <User size={18} className='mt-0.5 text-gray-400' />
                        <div>
                           <div className='text-xs text-gray-500'>Candidate ID</div>
                           <div className='text-sm font-medium'>{applicant.candidateId}</div>
                        </div>
                     </div>
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
                     {isLoadingCV ? (
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
                                 ? 'Nhấn "Xem CV" để xem trước hồ sơ ứng viên'
                                 : 'Ứng viên chưa tải lên CV'}
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Interview Scheduling Dialog */}
         <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
            <DialogContent className='sm:max-w-md'>
               <DialogHeader>
                  <DialogTitle>Lên lịch phỏng vấn</DialogTitle>
                  <DialogDescription>
                     Chọn thời gian và địa điểm cho buổi phỏng vấn với {applicant?.candidateName}
                  </DialogDescription>
               </DialogHeader>
               <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                     <Label htmlFor='interview-date'>
                        Ngày phỏng vấn <span className='text-red-500'>*</span>
                     </Label>
                     <Input
                        id='interview-date'
                        type='date'
                        value={interviewForm.date}
                        onChange={(e) => setInterviewForm(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='interview-time'>
                        Giờ phỏng vấn <span className='text-red-500'>*</span>
                     </Label>
                     <Input
                        id='interview-time'
                        type='time'
                        value={interviewForm.time}
                        onChange={(e) => setInterviewForm(prev => ({ ...prev, time: e.target.value }))}
                        required
                     />
                  </div>
                  <div className='space-y-2'>
                     <Label htmlFor='interview-location'>
                        Địa điểm <span className='text-red-500'>*</span>
                     </Label>
                     <select
                        id='interview-location'
                        value={interviewForm.locationId}
                        onChange={(e) => setInterviewForm(prev => ({ ...prev, locationId: Number(e.target.value) }))}
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
                     <p className='text-xs text-gray-500'>Danh sách lấy từ hồ sơ công ty của bạn</p>
                  </div>
               </div>
               <DialogFooter>
                  <Button
                     variant='outline'
                     onClick={() => {
                        setIsInterviewDialogOpen(false)
                        setInterviewForm({ date: '', time: '', locationId: 0 })
                     }}
                     disabled={interviewMutation.isPending}
                  >
                     Hủy
                  </Button>
                  <Button
                     variant='primary'
                     onClick={handleScheduleInterview}
                     disabled={interviewMutation.isPending || !interviewForm.date || !interviewForm.time || !interviewForm.locationId}
                  >
                     {interviewMutation.isPending ? (
                        <>
                           <Loader2 size={16} className='mr-2 animate-spin' />
                           Đang xử lý...
                        </>
                     ) : (
                        <>
                           <CheckCircle size={16} className='mr-2' />
                           Xác nhận
                        </>
                     )}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   )
}

