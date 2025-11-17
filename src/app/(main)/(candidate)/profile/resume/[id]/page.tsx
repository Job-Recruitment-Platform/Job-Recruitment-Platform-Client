'use client'

import Button from '@/components/shared/Button'
import { showErrorToast } from '@/lib/toast'
import candidateService from '@/services/candidate.service'
import { resourceService } from '@/services/resource.service'
import type { ResourceResponse } from '@/types/resource.type'
import {
   ArrowLeft,
   Download,
   FileText,
   Loader2,
   Mail,
   MapPin,
   Phone,
   User
} from 'lucide-react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useMemo, useState, useCallback } from 'react'

type CandidateDetailResponse =
   Awaited<ReturnType<typeof candidateService.getProfile>> extends { data: infer T }
      ? T
      : never

export default function CandidateResumeDetailPage() {
   const params = useParams<{ id: string }>()
   const resumeId = Number(params?.id)

   const [resume, setResume] = useState<ResourceResponse | null>(null)
   const [candidate, setCandidate] = useState<CandidateDetailResponse | null>(null)
   const [loading, setLoading] = useState(true)
   const [downloading, setDownloading] = useState(false)
   const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
   const [loadingPreview, setLoadingPreview] = useState(true)
   const [previewError, setPreviewError] = useState(false)
   const [previewType, setPreviewType] = useState<'pdf' | 'latex' | null>(null)
   const [previewContent, setPreviewContent] = useState<string | null>(null)

   // Load PDF preview using downloadResource
   const loadPdfPreview = useCallback(async (resumeData: ResourceResponse) => {
      try {
         setLoadingPreview(true)
         setPreviewError(false)
         
         const arrayBuffer = await resourceService.downloadResource(resumeData.url)
         if (!arrayBuffer) {
            throw new Error('Không có dữ liệu')
         }
         
         const mimeType = (resumeData.mimeType || '').toLowerCase()
         const fileName = (resumeData.name || '').toLowerCase()

         const hasPdfExtension = fileName.endsWith('.pdf')
         const hasPdfMimeType = mimeType === 'application/pdf' || mimeType.includes('/pdf')

         if (hasPdfExtension || hasPdfMimeType) {
            const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            setPdfPreviewUrl((prevUrl) => {
               if (prevUrl) window.URL.revokeObjectURL(prevUrl)
               return url
            })
            setPreviewType('pdf')
            setPreviewContent(null)
            return
         }

         const hasTextExtension =
            fileName.endsWith('.tex') || fileName.endsWith('.latex') || fileName.endsWith('.txt')
         const hasTextMimeType =
            mimeType.startsWith('text/') ||
            mimeType === 'application/x-tex' ||
            mimeType === 'text/x-latex'

         if (hasTextExtension && hasTextMimeType) {
            try {
               const textDecoder = new TextDecoder('utf-8')
               const textContent = textDecoder.decode(arrayBuffer)
               setPreviewContent(textContent)
               setPreviewType('latex')
               setPdfPreviewUrl((prevUrl) => {
                  if (prevUrl) window.URL.revokeObjectURL(prevUrl)
                  return null
               })
               return
            } catch {
               // fallthrough
            }
         }

         const blobType = resumeData.mimeType || 'application/pdf'
         const blob = new Blob([arrayBuffer], { type: blobType })
         const url = window.URL.createObjectURL(blob)
         setPdfPreviewUrl((prevUrl) => {
            if (prevUrl) window.URL.revokeObjectURL(prevUrl)
            return url
         })
         setPreviewType('pdf')
         setPreviewContent(null)
      } catch (err) {
         console.error('Error loading PDF preview:', err)
         setPreviewError(true)
         showErrorToast('Không thể tải CV để xem trước')
      } finally {
         setLoadingPreview(false)
      }
   }, [])

   useEffect(() => {
      let mounted = true

      if (!Number.isFinite(resumeId) || resumeId <= 0) {
         notFound()
         return
      }

      ;(async () => {
         try {
            const [resumeRes, candidateRes] = await Promise.all([
               candidateService.getCandidateResumes(1, 100),
               candidateService.getProfile()
            ])

            if (!mounted) return

            const resumeList = Array.isArray(resumeRes?.data?.content)
               ? (resumeRes?.data?.content as ResourceResponse[])
               : ([] as ResourceResponse[])
            const foundResume = resumeList.find((res) => res.id === resumeId)

            if (!foundResume) {
               notFound()
               return
            }

            setResume(foundResume)
            if (candidateRes?.data) setCandidate(candidateRes.data)
            
            // Load PDF preview
            if (foundResume && mounted) {
               await loadPdfPreview(foundResume)
            }
         } catch (err) {
            console.error('Load resume detail error:', err)
            showErrorToast('Không tải được thông tin CV')
            if (mounted) setPreviewError(true)
         } finally {
            if (mounted) setLoading(false)
         }
      })()

      return () => {
         mounted = false
      }
   }, [resumeId, loadPdfPreview])

   // Cleanup blob URL on unmount or when URL changes
   useEffect(() => {
      return () => {
         if (pdfPreviewUrl) {
            window.URL.revokeObjectURL(pdfPreviewUrl)
         }
      }
   }, [pdfPreviewUrl])

   const candidateAvatarUrl = useMemo(() => {
      if (!candidate?.resource) return undefined
      return candidate.resource.resourceType === 'AVATAR'
         ? candidate.resource.url
         : candidate.resource.url
   }, [candidate])

   const candidateLocation = useMemo(() => {
      if (!candidate?.location) return 'Chưa cập nhật'
      const { streetAddress, ward, provinceCity } = candidate.location
      return [streetAddress, ward, provinceCity].filter(Boolean).join(', ') || 'Chưa cập nhật'
   }, [candidate])

   const handleDownload = async () => {
      if (!resume) return
      try {
         setDownloading(true)
         const arrayBuffer = await resourceService.downloadResource(resume.url)
         if (!arrayBuffer) throw new Error('Không có dữ liệu')

         const blob = new Blob([arrayBuffer], { type: resume.mimeType || 'application/pdf' })
         const url = window.URL.createObjectURL(blob)
         const link = document.createElement('a')
         link.href = url
         link.download = resume.name || 'CV.pdf'
         document.body.appendChild(link)
         link.click()
         document.body.removeChild(link)
         window.URL.revokeObjectURL(url)
      } catch (err) {
         console.error('Download resume error:', err)
         showErrorToast('Không thể tải CV')
      } finally {
         setDownloading(false)
      }
   }

   if (loading) {
      return (
         <div className='flex h-[70vh] items-center justify-center'>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
               <Loader2 className='h-5 w-5 animate-spin text-primary' />
               Đang tải CV...
            </div>
         </div>
      )
   }

   if (!resume) {
      notFound()
   }

   return (
      <div className='bg-smoke min-h-screen py-6'>
         <div className='container mx-auto px-4'>
            <div className='mx-auto max-w-5xl space-y-6'>
               <HeaderSection resume={resume!} onDownload={handleDownload} downloading={downloading} />
               <CandidateInfoSection candidate={candidate} avatarUrl={candidateAvatarUrl} location={candidateLocation} />
               <ViewerSection
                  resume={resume!}
                  pdfPreviewUrl={pdfPreviewUrl}
                  loadingPreview={loadingPreview}
                  previewError={previewError}
                  previewType={previewType}
                  previewContent={previewContent}
               />
            </div>
         </div>
      </div>
   )
}

function HeaderSection({
   resume,
   onDownload,
   downloading
}: {
   resume: ResourceResponse
   onDownload: () => Promise<void> | void
   downloading: boolean
}) {
   return (
      <section className='flex flex-col gap-4 rounded-lg border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
         <div className='space-y-1'>
            <Link
               href='/profile/resume'
               className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700'
            >
               <ArrowLeft size={16} />
               Quay lại danh sách CV
            </Link>
            <div className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
               <FileText size={20} className='text-primary' />
               <span className='truncate'>{resume.name || 'CV của bạn'}</span>
            </div>
            <div className='text-xs text-gray-500'>
               Định dạng: {resume.mimeType || 'Không xác định'}
               {resume.uploadedAt && (
                  <>
                     <span className='mx-1'>•</span>
                     Tải lên: {formatDate(resume.uploadedAt)}
                  </>
               )}
            </div>
         </div>
         <Button onClick={onDownload} disabled={downloading} className='w-full sm:w-auto'>
            {downloading ? (
               <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang tải...
               </>
            ) : (
               <>
                  <Download className='mr-2 h-4 w-4' />
                  Tải CV
               </>
            )}
         </Button>
      </section>
   )
}

function CandidateInfoSection({
   candidate,
   avatarUrl,
   location
}: {
   candidate: CandidateDetailResponse | null
   avatarUrl?: string
   location: string
}) {
   if (!candidate) return null
   return (
      <section className='flex flex-col gap-4 rounded-lg border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
         <div className='flex items-center gap-3'>
            <div className='h-14 w-14 overflow-hidden rounded-full border'>
               {avatarUrl ? (
                  <img src={avatarUrl} alt={candidate.fullName} className='h-full w-full object-cover' />
               ) : (
                  <div className='flex h-full w-full items-center justify-center bg-primary/10 text-primary'>
                     <User size={20} />
                  </div>
               )}
            </div>
            <div className='space-y-1'>
               <div className='text-base font-semibold text-gray-900'>
                  {candidate.fullName || 'Ứng viên'}
               </div>
               <div className='flex flex-wrap items-center gap-2 text-xs text-gray-500'>
                  {candidate.email && (
                     <span className='inline-flex items-center gap-1.5'>
                        <Mail size={13} />
                        <span>{candidate.email}</span>
                     </span>
                  )}
                  {candidate.location && (
                     <span className='inline-flex items-center gap-1.5'>
                        <MapPin size={13} />
                        <span>{location}</span>
                     </span>
                  )}
               </div>
            </div>
         </div>
         <Link href='/profile/edit'>
            <Button variant='outline' className='w-full sm:w-auto'>
               Cập nhật hồ sơ
            </Button>
         </Link>
      </section>
   )
}

function ViewerSection({
   resume,
   pdfPreviewUrl,
   loadingPreview,
   previewError,
   previewType,
   previewContent
}: {
   resume: ResourceResponse
   pdfPreviewUrl: string | null
   loadingPreview: boolean
   previewError: boolean
   previewType: 'pdf' | 'latex' | null
   previewContent: string | null
}) {
   const isPdf =
      previewType === 'pdf' ||
      resume.mimeType?.includes('pdf') ||
      resume.name?.toLowerCase().endsWith('.pdf')

   return (
      <section className='rounded-lg border bg-white p-5 shadow-sm'>
         <div className='space-y-4'>
            <div className='flex items-center justify-between'>
               <h2 className='text-lg font-semibold text-gray-900'>Xem trước CV</h2>
               <span className='text-xs text-gray-500'>CV ID: {resume.id}</span>
            </div>
            <div className='h-[70vh] w-full overflow-hidden rounded-lg border bg-gray-50'>
               {loadingPreview ? (
                  <div className='flex h-full flex-col items-center justify-center gap-3 text-sm text-gray-500'>
                     <Loader2 className='h-8 w-8 animate-spin text-primary' />
                     <p>Đang tải CV...</p>
                  </div>
               ) : previewError ? (
                  <div className='flex h-full flex-col items-center justify-center gap-3 text-sm text-gray-500'>
                     <FileText size={32} className='text-gray-400' />
                     <p>Không thể tải CV để xem trước.</p>
                     <p className='text-xs'>Vui lòng tải xuống để xem chi tiết.</p>
                  </div>
               ) : previewType === 'latex' && previewContent ? (
                  <div className='h-full overflow-auto rounded-lg border bg-gray-50 p-4'>
                     <pre className='whitespace-pre-wrap font-mono text-sm text-gray-800'>
                        {previewContent}
                     </pre>
                  </div>
               ) : isPdf && pdfPreviewUrl ? (
                  <iframe
                     title={resume.name || 'CV Preview'}
                     src={pdfPreviewUrl}
                     className='h-full w-full border-0'
                     style={{ minHeight: '100%' }}
                  />
               ) : (
                  <div className='flex h-full flex-col items-center justify-center gap-3 text-sm text-gray-500'>
                     <FileText size={32} className='text-primary' />
                     <p>Không thể xem trước định dạng này.</p>
                     <p className='text-xs'>Vui lòng tải xuống để xem chi tiết.</p>
                  </div>
               )}
            </div>
         </div>
      </section>
   )
}

function formatDate(value: string) {
   const date = new Date(value)
   if (Number.isNaN(date.getTime())) return 'Không xác định'
   return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
   }).format(date)
}

