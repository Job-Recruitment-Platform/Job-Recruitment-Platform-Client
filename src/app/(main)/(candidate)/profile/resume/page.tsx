'use client'

import Button from '@/components/shared/Button'
import Pagination from '@/components/ui/pagination'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import candidateService from '@/services/candidate.service'
import { resourceService } from '@/services/resource.service'
import { ResourceResponse, ResourceType } from '@/types/resource.type'
import { Eye, FileText, Trash2, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const PAGE_SIZE = 10

export default function ResumePage() {
   const [resumes, setResumes] = useState<ResourceResponse[]>([])
   const [loading, setLoading] = useState(true)
   const [uploading, setUploading] = useState(false)
   const [deletingId, setDeletingId] = useState<number | null>(null)
   const [selectedFile, setSelectedFile] = useState<File | null>(null)
   const [dragActive, setDragActive] = useState(false)
   const [page, setPage] = useState(1)
   const [paginationData, setPaginationData] = useState<{
      totalElements: number
      totalPages: number
      hasNext: boolean
      hasPrevious: boolean
   } | null>(null)
   const router = useRouter()

   useEffect(() => {
      loadResumes(page)
   }, [page])

   const loadResumes = async (pageToLoad: number = page) => {
      try {
         setLoading(true)
         const normalizedPage = pageToLoad < 1 ? 1 : pageToLoad
         const res = await candidateService.getCandidateResumes(normalizedPage, PAGE_SIZE)
         if (res?.data?.content && Array.isArray(res.data.content)) {
            // Filter only CV type resources
            const cvResumes = res.data.content.filter(
               (resource: ResourceResponse) => resource.resourceType === ResourceType.CV
            )
            setResumes(cvResumes)
            const totalElements = res.data.totalElements ?? cvResumes.length
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
            setResumes([])
            setPaginationData(null)
         }
      } catch (err) {
         console.error('Load resumes error:', err)
         showErrorToast('Không tải được danh sách CV')
      } finally {
         setLoading(false)
      }
   }

   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         // Validate file type
         const allowedTypes = ['.pdf', '.doc', '.docx']
         const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
         if (!allowedTypes.includes(fileExt)) {
            showErrorToast('Chỉ chấp nhận file PDF, DOC, DOCX')
            return
         }
         // Validate file size (5MB)
         if (file.size > 5 * 1024 * 1024) {
            showErrorToast('File không được vượt quá 5MB')
            return
         }
         setSelectedFile(file)
      }
      // Reset input
      if (e.target) {
         e.target.value = ''
      }
   }

   const handleUpload = async () => {
      if (!selectedFile) return

      try {
         setUploading(true)
         const res = await resourceService.uploadResume(selectedFile)
         if (res?.code === 1000) {
            showSuccessToast('Tải CV lên thành công')
            setSelectedFile(null)
            if (page === 1) {
               await loadResumes(1)
            } else {
               setPage(1)
            }
         } else {
            showErrorToast(res?.message || 'Tải CV lên thất bại')
         }
      } catch (err) {
         console.error('Upload resume error:', err)
         const message =
            typeof err === 'object' && err && 'message' in err
               ? String((err as { message?: string }).message)
               : undefined
         showErrorToast(message || 'Có lỗi khi tải CV lên')
      } finally {
         setUploading(false)
      }
   }

   const handleDelete = async (id: number) => {
      if (!confirm('Bạn có chắc chắn muốn xóa CV này?')) {
         return
      }

      try {
         setDeletingId(id)
         const res = await resourceService.deleteResource(id)
         if (res?.code === 1000) {
            showSuccessToast('Xóa CV thành công')
            if (resumes.length === 1 && page > 1) {
               setPage((prev) => Math.max(prev - 1, 1))
            } else {
               await loadResumes()
            }
         } else {
            showErrorToast(res?.message || 'Xóa CV thất bại')
         }
      } catch (err) {
         console.error('Delete resume error:', err)
         const message =
            typeof err === 'object' && err && 'message' in err
               ? String((err as { message?: string }).message)
               : undefined
         showErrorToast(message || 'Có lỗi khi xóa CV')
      } finally {
         setDeletingId(null)
      }
   }

   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const file = e.dataTransfer.files?.[0]
      if (file) {
         const allowedTypes = ['.pdf', '.doc', '.docx']
         const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
         if (!allowedTypes.includes(fileExt)) {
            showErrorToast('Chỉ chấp nhận file PDF, DOC, DOCX')
            return
         }
         if (file.size > 5 * 1024 * 1024) {
            showErrorToast('File không được vượt quá 5MB')
            return
         }
         setSelectedFile(file)
      }
   }

   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(true)
   }

   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
   }

   const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
         year: 'numeric',
         month: 'long',
         day: 'numeric'
      })
   }


   return (
      <div className='bg-smoke min-h-screen py-6'>
         <div className='container mx-auto px-4'>
            <div className='mx-auto max-w-4xl'>
               <div className='mb-6 flex items-center justify-between'>
                  <div>
                     <h1 className='text-2xl font-semibold'>Quản lý CV</h1>
                     <p className='text-sm text-gray-500'>Tải lên và quản lý CV của bạn</p>
                  </div>
                  <Link href='/profile'>
                     <Button variant='outline'>Quay lại</Button>
                  </Link>
               </div>

               {/* Upload Section */}
               <section className='mb-6 rounded-lg border bg-white p-6'>
                  <h2 className='mb-4 text-lg font-semibold'>Tải CV lên</h2>
                  <div className='space-y-4'>
                     {/* Hidden Input */}
                     <input
                        id='resume-upload'
                        type='file'
                        accept='.pdf,.doc,.docx'
                        className='hidden'
                        onChange={handleFileSelect}
                     />

                     {/* File Upload Area */}
                     <div
                        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
                           dragActive
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => document.getElementById('resume-upload')?.click()}
                     >
                        <Upload
                           size={24}
                           className={`mx-auto mb-2 ${
                              dragActive ? 'text-primary' : 'text-gray-400'
                           }`}
                        />
                        <p className='text-sm font-medium text-gray-700'>
                           Tải lên CV từ máy tính, chọn hoặc kéo thả
                        </p>
                        <p className='mb-3 text-xs text-gray-600'>
                           Hỗ trợ định dạng .pdf, .doc, .docx có kích thước dưới 5MB
                        </p>

                        <div className='flex justify-center' onClick={(e) => e.stopPropagation()}>
                           <Button
                              variant='primary'
                              className='cursor-pointer'
                              type='button'
                              onClick={() => document.getElementById('resume-upload')?.click()}
                           >
                              Chọn CV
                           </Button>
                        </div>

                        {selectedFile && (
                           <div className='mt-3 flex items-center justify-center gap-2'>
                              <p className='text-sm text-green-600'>✓ Đã chọn: {selectedFile.name}</p>
                              <button
                                 onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedFile(null)
                                 }}
                                 className='text-xs text-red-500 underline hover:text-red-700'
                                 type='button'
                              >
                                 <X size={14} className='inline' /> Xóa
                              </button>
                           </div>
                        )}
                     </div>

                     {/* Upload Button */}
                     {selectedFile && (
                        <div className='flex justify-end'>
                           <Button
                              variant='primary'
                              onClick={handleUpload}
                              disabled={uploading}
                           >
                              {uploading ? 'Đang tải lên...' : 'Tải CV lên'}
                           </Button>
                        </div>
                     )}
                  </div>
               </section>

               {/* Resumes List Section */}
               <section className='rounded-lg border bg-white p-6'>
                  <div className='mb-4 flex items-center justify-between'>
                     <h2 className='text-lg font-semibold'>CV đã tải lên</h2>
                     {paginationData && paginationData.totalElements > 0 && (
                        <p className='text-sm text-gray-500'>
                           Tổng: {paginationData.totalElements} CV
                        </p>
                     )}
                  </div>

                  {loading ? (
                     <div className='py-8 text-center text-gray-500'>Đang tải...</div>
                  ) : resumes.length === 0 ? (
                     <div className='py-8 text-center text-gray-500'>
                        <FileText size={48} className='mx-auto mb-2 text-gray-300' />
                        <p>Bạn chưa có CV nào</p>
                        <p className='text-sm'>Tải CV lên để bắt đầu</p>
                     </div>
                  ) : (
                     <>
                        <div className='space-y-3'>
                           {resumes.map((resume) => (
                              <div
                                 key={resume.id}
                                 className='flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50'
                              >
                                 <div className='flex items-center gap-4 flex-1'>
                                    <FileText size={24} className='text-primary' />
                                    <div className='flex-1'>
                                       <p className='font-medium text-gray-900'>{resume.name}</p>
                                       <div className='mt-1 flex items-center gap-4 text-sm text-gray-500'>
                                          <span>Tải lên: {formatDate(resume.uploadedAt)}</span>
                                          {resume.contentType && (
                                             <span>• {resume.contentType}</span>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                                 <div className='flex items-center gap-2'>
                                    <Button
                                       variant='outline'
                                       onClick={() => router.push(`/profile/resume/${resume.id}`)}
                                       className='flex items-center gap-2'
                                    >
                                       <Eye size={16} />
                                       Xem
                                    </Button>
                                    <Button
                                       variant='ghost'
                                       onClick={() => handleDelete(resume.id)}
                                       disabled={deletingId === resume.id}
                                       className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                    >
                                       {deletingId === resume.id ? (
                                          'Đang xóa...'
                                       ) : (
                                          <>
                                             <Trash2 size={16} />
                                             Xóa
                                          </>
                                       )}
                                    </Button>
                                 </div>
                              </div>
                           ))}
                        </div>

                        {paginationData && (
                           <div className='mt-6 flex items-center justify-between border-t pt-4'>
                              <div className='text-sm text-gray-500'>
                                 Hiển thị{' '}
                                 {paginationData.totalElements === 0
                                    ? 0
                                    : (page - 1) * PAGE_SIZE + 1}
                                 –
                                 {Math.min(
                                    page * PAGE_SIZE,
                                    paginationData.totalElements
                                 )}{' '}
                                 trong số {paginationData.totalElements} CV
                              </div>
                              {paginationData.totalPages > 1 && (
                                 <Pagination
                                    onPrev={() =>
                                       setPage((prev) =>
                                          paginationData.hasPrevious
                                             ? Math.max(prev - 1, 1)
                                             : prev
                                       )
                                    }
                                    onNext={() =>
                                       setPage((prev) =>
                                          paginationData.hasNext
                                             ? Math.min(prev + 1, paginationData.totalPages)
                                             : prev
                                       )
                                    }
                                    disabledPrev={!paginationData.hasPrevious}
                                    disabledNext={!paginationData.hasNext}
                                 >
                                    {Array.from({ length: paginationData.totalPages }).map(
                                       (_, index) => {
                                          const pageNum = index + 1
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
                                       }
                                    )}
                                 </Pagination>
                              )}
                           </div>
                        )}
                     </>
                  )}
               </section>
            </div>
         </div>
      </div>
   )
}

