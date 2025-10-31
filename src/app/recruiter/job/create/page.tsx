'use client'

import Button from '@/components/shared/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { showErrorToast, showSuccessToast } from '@/lib/toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { jobService } from '@/services/job.service'
import { recruiterService } from '@/services/recruiter.service'
import { companyService } from '@/services/company.service'
import { jobCategoryService } from '@/services/job-category.service'
import { CreateJobRequest } from '@/types/job.type'
import { Loader2, ArrowLeft, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateJobPage() {
   const router = useRouter()
   const queryClient = useQueryClient()

   const [formData, setFormData] = useState<CreateJobRequest>({
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
      maxCandidates: undefined,
      dateExpires: '',
      summary: '',
      responsibilities: '',
      requirements: '',
      niceToHave: '',
      benefits: '',
      hiringProcess: '',
      notes: '',
      saveAsDraft: false,
      skills: []
   })

   const [familyPage, setFamilyPage] = useState(0)
   const [selectedFamilyId, setSelectedFamilyId] = useState<number>(0)
   const [selectedSubFamilyId, setSelectedSubFamilyId] = useState<number>(0)

   const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
      queryKey: ['job-categories', familyPage],
      queryFn: () => jobCategoryService.getAllCategories(familyPage, 10),
      staleTime: 5 * 60 * 1000
   })

   const families = categoriesData?.content || []
   const subFamilies = families.find((f: any) => f.id === selectedFamilyId)?.subFamilies || []
   const jobRoles = subFamilies.find((sf: any) => sf.id === selectedSubFamilyId)?.jobRoles || []

   // Fetch recruiter profile to get companyId (cached globally)
   const { data: recruiterProfile } = useQuery({
      queryKey: ['recruiter-profile'],
      queryFn: () => recruiterService.getProfile(),
      staleTime: 5 * 60 * 1000
   })

   const companyId = recruiterProfile?.data?.company?.id

   // Fetch company profile to get company locations (cached)
   const { data: companyProfile } = useQuery({
      queryKey: ['company-profile', companyId],
      queryFn: () => companyService.getCompanyProfile(companyId as number),
      enabled: !!companyId,
      staleTime: 5 * 60 * 1000
   })

   const companyLocations = (companyProfile?.data?.companyLocations || []) as Array<any>

   const createMutation = useMutation({
      mutationFn: (data: CreateJobRequest) => jobService.createJob(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['recruiter-jobs'] })
         showSuccessToast('Tạo tin tuyển dụng thành công')
         router.push('/recruiter/job')
      },
      onError: () => {
         showErrorToast('Không thể tạo tin tuyển dụng')
      }
   })

   const handleInputChange = (field: keyof CreateJobRequest, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))
   }

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.title || !formData.jobRoleId || !formData.locationId || !formData.dateExpires) {
         showErrorToast('Vui lòng điền đầy đủ các trường bắt buộc')
         return
      }
      createMutation.mutate(formData)
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
                  <h1 className='text-xl font-semibold'>Tạo tin tuyển dụng</h1>
                  <p className='text-sm text-gray-500'>Điền thông tin chi tiết cho tin tuyển dụng mới</p>
               </div>
            </div>
            <Button 
               onClick={handleSubmit} 
               disabled={createMutation.isPending}
               form='create-job-form'
            >
               {createMutation.isPending ? 'Đang tạo...' : 'Tạo tin'}
            </Button>
         </div>

         <form id='create-job-form' onSubmit={handleSubmit} className='space-y-6'>
            {/* Basic Information */}
            <section className='rounded-md border bg-white p-6'>
               <h2 className='mb-4 text-sm font-semibold'>Thông tin cơ bản</h2>
               <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='sm:col-span-2'>
                     <label className='mb-1 block text-xs text-gray-600'>
                        Tiêu đề <span className='text-red-500'>*</span>
                     </label>
                     <Input
                        value={formData.title}
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
                        required
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
                        value={formData.seniorityLevel}
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
                     <label className='mb-1 block text-xs text-gray-600'>Số năm kinh nghiệm</label>
                     <Input
                        type='number'
                        min={0}
                        value={formData.minExperienceYears}
                        onChange={(e) => handleInputChange('minExperienceYears', Number(e.target.value))}
                     />
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
                     <p className='mt-1 text-xs text-gray-500'>Danh sách lấy từ hồ sơ công ty của bạn.</p>
                  </div>

                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Hình thức làm việc</label>
                     <select
                        value={formData.workMode}
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
                        value={formData.employmentType}
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
                        value={formData.currency}
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
                        value={formData.summary}
                        onChange={(e) => handleInputChange('summary', e.target.value)}
                        rows={3}
                        placeholder='Tóm tắt ngắn gọn về công việc...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Trách nhiệm</label>
                     <Textarea
                        value={formData.responsibilities}
                        onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                        rows={5}
                        placeholder='Mô tả các trách nhiệm chính...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Yêu cầu</label>
                     <Textarea
                        value={formData.requirements}
                        onChange={(e) => handleInputChange('requirements', e.target.value)}
                        rows={5}
                        placeholder='Các yêu cầu bắt buộc...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Kỹ năng mong muốn</label>
                     <Textarea
                        value={formData.niceToHave}
                        onChange={(e) => handleInputChange('niceToHave', e.target.value)}
                        rows={3}
                        placeholder='Các kỹ năng ưu tiên (không bắt buộc)...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Phúc lợi</label>
                     <Textarea
                        value={formData.benefits}
                        onChange={(e) => handleInputChange('benefits', e.target.value)}
                        rows={3}
                        placeholder='Các phúc lợi dành cho nhân viên...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Quy trình tuyển dụng</label>
                     <Textarea
                        value={formData.hiringProcess}
                        onChange={(e) => handleInputChange('hiringProcess', e.target.value)}
                        rows={3}
                        placeholder='Mô tả các bước trong quy trình tuyển dụng...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Ghi chú nội bộ</label>
                     <Textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={2}
                        placeholder='Ghi chú nội bộ (không hiển thị công khai)...'
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Kỹ năng (Cách nhau bởi dấu phẩy)</label>
                     <Input
                        placeholder='VD: Java, C#, React, Angular...'
                        onChange={(e) => {
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
               <Button type='submit' disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Đang tạo...' : 'Tạo tin'}
               </Button>
            </div>
         </form>
      </div>
   )
}

