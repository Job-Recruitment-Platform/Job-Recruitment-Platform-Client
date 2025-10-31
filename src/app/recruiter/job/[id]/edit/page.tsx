'use client'

import Button from '@/components/shared/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobService } from '@/services/job.service'
import { useJob } from '@/hooks/useJob'
import { UpdateJobRequest } from '@/types/job.type'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { jobCategoryService } from '@/services/job-category.service'
import { recruiterService } from '@/services/recruiter.service'
import { companyService } from '@/services/company.service'
import type { JobFamily, SubFamily } from '@/types/job-category.type'

export default function EditJobPage() {
   const router = useRouter()
   const params = useParams()
   const jobId = Number(params.id)
   const queryClient = useQueryClient()

   const { data: jobDetail, isLoading, isError } = useJob(jobId)
   
   const [formData, setFormData] = useState<Partial<UpdateJobRequest>>({
      title: '',
      jobRoleId: 0,
      seniorityLevel: 'JUNIOR',
      employmentType: 'FULL_TIME',
      minExperienceYears: 0,
      locationId: 0,
      workMode: 'ONSITE',
      salaryMin: 0,
      salaryMax: 0,
      currency: 'VND',
      dateExpires: '',
      summary: '',
      responsibilities: '',
      requirements: '',
      niceToHave: '',
      benefits: '',
      hiringProcess: '',
      notes: '',
      skills: []
   })
   const [skillsText, setSkillsText] = useState('')

   // Job category selection (family → subfamily → role)
   const [familyPage, setFamilyPage] = useState(0)
   const [selectedFamilyId, setSelectedFamilyId] = useState<number>(0)
   const [selectedSubFamilyId, setSelectedSubFamilyId] = useState<number>(0)

   const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
      queryKey: ['job-categories', familyPage],
      queryFn: () => jobCategoryService.getAllCategories(familyPage, 10),
      staleTime: 5 * 60 * 1000
   })

   const families = (categoriesData?.content || []) as JobFamily[]
   const subFamilies = (families.find((f) => f.id === selectedFamilyId)?.subFamilies || []) as SubFamily[]
   const jobRoles = (subFamilies.find((sf) => sf.id === selectedSubFamilyId)?.jobRoles || [])

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

   useEffect(() => {
      if (jobDetail) {
         setFormData({
            title: jobDetail.title,
            jobRoleId: 0, // Would need to fetch or map from jobRole string
            seniorityLevel: jobDetail.seniority as any,
            employmentType: 'FULL_TIME', // Not in JobDetail, using default
            minExperienceYears: jobDetail.minExperienceYears,
            locationId: 0, // Would need to fetch or map from location string
            workMode: jobDetail.workMode,
            salaryMin: jobDetail.salaryMin,
            salaryMax: jobDetail.salaryMax,
            currency: jobDetail.currency,
            dateExpires: jobDetail.dateExpires,
            summary: jobDetail.summary,
            responsibilities: jobDetail.responsibilities,
            requirements: jobDetail.requirements,
            niceToHave: jobDetail.niceToHave,
            benefits: jobDetail.benefits,
            hiringProcess: jobDetail.hiringProcess,
            notes: jobDetail.notes,
            skills: (jobDetail.skills || []).map(s => s.name)
         })
         setSkillsText((jobDetail.skills || []).map(s => s.name).join(', '))
      }
   }, [jobDetail])

   const updateMutation = useMutation({
      mutationFn: (data: UpdateJobRequest) => jobService.updateJob(jobId, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['jobDetail', jobId] })
         queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] })
         showSuccessToast('Cập nhật tin tuyển dụng thành công')
         router.push('/recruiter/job')
      },
      onError: () => {
         showErrorToast('Không thể cập nhật tin tuyển dụng')
      }
   })

   const handleInputChange = (field: keyof UpdateJobRequest, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.title || !formData.dateExpires || !formData.jobRoleId || !formData.locationId) {
         showErrorToast('Vui lòng điền đầy đủ thông tin bắt buộc')
         return
      }
      updateMutation.mutate(formData as UpdateJobRequest)
   }

   if (isLoading) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
         </div>
      )
   }

   if (isError || !jobDetail) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <div className='text-center'>
               <p className='text-gray-500'>Không tìm thấy tin tuyển dụng</p>
               <Link href='/recruiter/job'>
                  <Button variant='outline' className='mt-4'>
                     Quay lại danh sách
                  </Button>
               </Link>
            </div>
         </div>
      )
   }

   

   return (
      <div className='space-y-6'>
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
               <Link href='/recruiter/job'>
                  <Button variant='ghost' className='!p-2'>
                     <ArrowLeft size={20} />
                  </Button>
               </Link>
               <div>
                  <h1 className='text-xl font-semibold'>Chỉnh sửa tin tuyển dụng</h1>
                  <p className='text-sm text-gray-500'>{jobDetail.title}</p>
               </div>
            </div>
            <Button 
               onClick={handleSubmit} 
               disabled={updateMutation.isPending}
               form='edit-job-form'
            >
               {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
         </div>

         <form id='edit-job-form' onSubmit={handleSubmit} className='space-y-6'>
            {/* Basic Information */}
            <section className='rounded-md border bg-white p-6'>
               <h2 className='mb-4 text-sm font-semibold'>Thông tin cơ bản</h2>
               <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='sm:col-span-2'>
                     <label className='mb-1 block text-xs text-gray-600'>
                        Tiêu đề <span className='text-red-500'>*</span>
                     </label>
                     <Input
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder='VD: Frontend Developer'
                        required
                     />
                  </div>
                  <div className='sm:col-span-2'>
                     <label className='mb-1 block text-xs text-gray-600'>Ngành nghề (Job Family)</label>
                     <div className='flex items-center gap-2'>
                        <select
                           value={selectedFamilyId}
                           onChange={(e) => {
                              const id = Number(e.target.value)
                              setSelectedFamilyId(id)
                              setSelectedSubFamilyId(0)
                              handleInputChange('jobRoleId', 0)
                           }}
                           className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                           disabled={categoriesLoading}
                        >
                           <option value={0}>Chọn nhóm ngành</option>
                           {families.map((cat: any) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                           ))}
                        </select>
                        <div className='flex items-center gap-1'>
                           <Button 
                              type='button' 
                              variant='outline' 
                              className='!px-2'
                              disabled={categoriesLoading || !categoriesData?.hasPrevious}
                              onClick={() => setFamilyPage((p) => Math.max(0, p - 1))}
                           >
                              «
                           </Button>
                           <Button 
                              type='button' 
                              variant='outline' 
                              className='!px-2'
                              disabled={categoriesLoading || !categoriesData?.hasNext}
                              onClick={() => setFamilyPage((p) => p + 1)}
                           >
                              »
                           </Button>
                        </div>
                     </div>
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Chuyên ngành (Sub Family)</label>
                     <select
                        value={selectedSubFamilyId}
                        onChange={(e) => {
                           const id = Number(e.target.value)
                           setSelectedSubFamilyId(id)
                           handleInputChange('jobRoleId', 0)
                        }}
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                        disabled={!selectedFamilyId}
                     >
                        <option value={0}>Chọn chuyên ngành</option>
                        {subFamilies.map((sf: any) => (
                           <option key={sf.id} value={sf.id}>{sf.name}</option>
                        ))}
                     </select>
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Vai trò (Job Role) <span className='text-red-500'>*</span></label>
                     <select
                        value={formData.jobRoleId || 0}
                        onChange={(e) => handleInputChange('jobRoleId', Number(e.target.value))}
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                        disabled={!selectedSubFamilyId}
                     >
                        <option value={0}>Chọn vai trò</option>
                        {jobRoles.map((jr: any) => (
                           <option key={jr.id} value={jr.id}>{jr.name}</option>
                        ))}
                     </select>
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Cấp độ</label>
                     <select
                        value={formData.seniorityLevel || 'JUNIOR'}
                        onChange={(e) => handleInputChange('seniorityLevel', e.target.value)}
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                     >
                        <option value='INTERN'>Intern</option>
                        <option value='JUNIOR'>Junior</option>
                        <option value='MID'>Mid</option>
                        <option value='SENIOR'>Senior</option>
                        <option value='LEAD'>Lead</option>
                        <option value='MANAGER'>Manager</option>
                     </select>
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Địa điểm công ty <span className='text-red-500'>*</span></label>
                     <select
                        value={formData.locationId || 0}
                        onChange={(e) => handleInputChange('locationId', Number(e.target.value))}
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                        disabled={!companyId}
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
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Số năm kinh nghiệm</label>
                     <Input
                        type='number'
                        min={0}
                        value={formData.minExperienceYears || 0}
                        onChange={(e) => handleInputChange('minExperienceYears', Number(e.target.value))}
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Hình thức làm việc</label>
                     <select
                        value={formData.workMode || 'ONSITE'}
                        onChange={(e) => handleInputChange('workMode', e.target.value)}
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                     >
                        <option value='ONSITE'>Tại văn phòng</option>
                        <option value='REMOTE'>Làm việc từ xa</option>
                        <option value='HYBRID'>Kết hợp</option>
                     </select>
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Loại việc làm</label>
                     <select
                        value={formData.employmentType || 'FULL_TIME'}
                        onChange={(e) => handleInputChange('employmentType', e.target.value)}
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                     >
                        <option value='FULL_TIME'>Toàn thời gian</option>
                        <option value='PART_TIME'>Bán thời gian</option>
                        <option value='CONTRACT'>Hợp đồng</option>
                        <option value='INTERNSHIP'>Thực tập</option>
                     </select>
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>
                        Hạn nộp hồ sơ <span className='text-red-500'>*</span>
                     </label>
                     <Input
                        type='date'
                        value={formData.dateExpires ? new Date(formData.dateExpires).toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                           const iso = new Date(`${e.target.value}T23:59:59`).toISOString()
                           handleInputChange('dateExpires', iso)
                        }}
                        required
                     />
                  </div>
               </div>
            </section>

            {/* Salary Information */}
            <section className='rounded-md border bg-white p-6'>
               <h2 className='mb-4 text-sm font-semibold'>Mức lương</h2>
               <div className='grid gap-4 sm:grid-cols-3'>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Lương tối thiểu</label>
                     <Input
                        type='number'
                        min={0}
                        value={formData.salaryMin || 0}
                        onChange={(e) => handleInputChange('salaryMin', Number(e.target.value))}
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Lương tối đa</label>
                     <Input
                        type='number'
                        min={0}
                        value={formData.salaryMax || 0}
                        onChange={(e) => handleInputChange('salaryMax', Number(e.target.value))}
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Đơn vị tiền tệ</label>
                     <select
                        value={formData.currency || 'VND'}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                     >
                        <option value='VND'>VND</option>
                        <option value='USD'>USD</option>
                     </select>
                  </div>
               </div>
            </section>

            {/* Job Description */}
            <section className='rounded-md border bg-white p-6'>
               <h2 className='mb-4 text-sm font-semibold'>Mô tả công việc</h2>
               <div className='space-y-4'>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Tóm tắt</label>
                     <Textarea
                        value={formData.summary || ''}
                        onChange={(e) => handleInputChange('summary', e.target.value)}
                        rows={3}
                        placeholder='Tóm tắt ngắn gọn về công việc...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Trách nhiệm</label>
                     <Textarea
                        value={formData.responsibilities || ''}
                        onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                        rows={5}
                        placeholder='Mô tả các trách nhiệm chính...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Yêu cầu</label>
                     <Textarea
                        value={formData.requirements || ''}
                        onChange={(e) => handleInputChange('requirements', e.target.value)}
                        rows={5}
                        placeholder='Các yêu cầu bắt buộc...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Kỹ năng mong muốn</label>
                     <Textarea
                        value={formData.niceToHave || ''}
                        onChange={(e) => handleInputChange('niceToHave', e.target.value)}
                        rows={3}
                        placeholder='Các kỹ năng ưu tiên (không bắt buộc)...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Phúc lợi</label>
                     <Textarea
                        value={formData.benefits || ''}
                        onChange={(e) => handleInputChange('benefits', e.target.value)}
                        rows={3}
                        placeholder='Các phúc lợi dành cho nhân viên...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Quy trình tuyển dụng</label>
                     <Textarea
                        value={formData.hiringProcess || ''}
                        onChange={(e) => handleInputChange('hiringProcess', e.target.value)}
                        rows={3}
                        placeholder='Mô tả các bước trong quy trình tuyển dụng...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Ghi chú nội bộ</label>
                     <Textarea
                        value={formData.notes || ''}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={2}
                        placeholder='Ghi chú nội bộ (không hiển thị công khai)...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Kỹ năng (Cách nhau bởi dấu phẩy)</label>
                     <Input
                        placeholder='VD: Java, C#, React, Angular...'
                        value={skillsText}
                        onChange={(e) => {
                           setSkillsText(e.target.value)
                           const skills = e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                           handleInputChange('skills', skills)
                        }}
                     />
                  </div>
               </div>
            </section>

            <div className='flex justify-end gap-3'>
               <Link href='/recruiter/job'>
                  <Button type='button' variant='outline'>
                     Hủy
                  </Button>
               </Link>
               <Button type='submit' disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
               </Button>
            </div>
         </form>
      </div>
   )
}

