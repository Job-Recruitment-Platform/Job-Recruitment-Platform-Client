'use client'

import Button from '@/components/shared/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { Building2, Camera, MapPin, Plus, X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyService } from '@/services/company.service'
import { resourceService } from '@/services/resource.service'
import { recruiterService } from '@/services/recruiter.service'
import type { CompanyRequest, LocationRequest } from '@/types/company.type'

export default function RecruiterCompanySettingsPage() {
   const queryClient = useQueryClient()
   const [avatarPreview, setAvatarPreview] = useState<string>('')
   const [avatarFile, setAvatarFile] = useState<File | null>(null)
   const [locations, setLocations] = useState<LocationRequest[]>([{
      streetAddress: '',
      ward: '',
      district: '',
      provinceCity: '',
      country: 'Việt Nam'
   }])
   const [formData, setFormData] = useState<CompanyRequest>({
      name: '',
      website: '',
      size: '',
      companyLocations: [],
      description: '',
      phone: '',
      email: '',
      industry: ''
   })

   // Fetch recruiter profile to get company ID
   const { data: recruiterData, isLoading: recruiterLoading } = useQuery({
      queryKey: ['recruiter-profile'],
      queryFn: () => recruiterService.getProfile(),
      refetchOnWindowFocus: false
   })

   const companyId = recruiterData?.data?.company?.id

   // Fetch company profile
   const { data, isLoading } = useQuery({
      queryKey: ['company-profile', companyId],
      queryFn: async () => {
         if (!companyId) throw new Error('No company ID found')
         return await companyService.getCompanyProfile(companyId)
      },
      enabled: !!companyId,
      refetchOnWindowFocus: false
   })

   const companyData = data?.data

   // Update form when data is loaded
   useEffect(() => {
      if (companyData) {
         setFormData({
            name: companyData.name || '',
            website: companyData.website || '',
            size: companyData.size || '',
            companyLocations: [],
            description: companyData.description || '',
            phone: companyData.phone || '',
            email: companyData.email || '',
            industry: companyData.industry || ''
         })
         
         // Convert Location response to LocationRequest array
         const locationData: LocationRequest[] = companyData.companyLocations?.map(loc => ({
            streetAddress: loc.location.streetAddress || '',
            ward: loc.location.ward || '',
            district: loc.location.district || '',
            provinceCity: loc.location.provinceCity || '',
            country: loc.location.country || 'Việt Nam'
         })) || [{
            streetAddress: '',
            ward: '',
            district: '',
            provinceCity: '',
            country: 'Việt Nam'
         }]
         
         setLocations(locationData)
         
         if (companyData.resource?.url) {
            setAvatarPreview(companyData.resource.url)
         }
      }
   }, [companyData])

   // Upload company logo mutation
   const uploadLogoMutation = useMutation({
      mutationFn: (file: File) => resourceService.uploadCompanyLogo(file),
      onSuccess: (response) => {
         setAvatarPreview(response.data.url)
         showSuccessToast('Tải logo thành công')
      },
      onError: (error: any) => {
         showErrorToast(error?.message || 'Không thể tải logo lên')
      }
   })

   // Update company mutation
   const updateMutation = useMutation({
      mutationFn: (data: CompanyRequest) => companyService.updateCompanyProfile(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['company-profile'] })
         showSuccessToast('Lưu hồ sơ công ty thành công')
      },
      onError: (error: any) => {
         showErrorToast(error?.message || 'Có lỗi xảy ra khi lưu hồ sơ')
      }
   })

   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         // Validate file size (5MB)
         if (file.size > 5 * 1024 * 1024) {
            showErrorToast('Kích thước file không được vượt quá 5MB')
            return
         }

         // Validate file type
         if (!file.type.startsWith('image/')) {
            showErrorToast('Vui lòng chọn file ảnh')
            return
         }

         setAvatarFile(file)
         
         // Show preview immediately
         const reader = new FileReader()
         reader.onloadend = () => {
            setAvatarPreview(reader.result as string)
         }
         reader.readAsDataURL(file)

         // Upload to server
         uploadLogoMutation.mutate(file)
      }
   }

   const addLocation = () => {
      setLocations([...locations, {
         streetAddress: '',
         ward: '',
         district: '',
         provinceCity: '',
         country: 'Việt Nam'
      }])
   }

   const removeLocation = (index: number) => {
      if (locations.length > 1) {
         const newLocations = locations.filter((_, i) => i !== index)
         setLocations(newLocations)
      }
   }

   const updateLocationField = (index: number, field: keyof LocationRequest, value: string) => {
      const newLocations = [...locations]
      newLocations[index] = { ...newLocations[index], [field]: value }
      setLocations(newLocations)
   }

   const handleInputChange = (field: keyof CompanyRequest, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))
   }

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault()
   
   const companyLocations = locations
      // use safe checks so .trim() is never called on undefined
      .filter(loc => ((loc.streetAddress ?? '').trim() !== '') || ((loc.district ?? '').trim() !== ''))
      .map((loc, index) => ({ 
         location: {
            streetAddress: loc.streetAddress ?? '',
            ward: loc.ward ?? '',
            district: loc.district ?? '',
            provinceCity: loc.provinceCity ?? '',
            country: loc.country ?? 'Việt Nam'
         },
         isHeadquarter: index === 0 // First location is headquarters
      }))

   const submitData: CompanyRequest = {
      ...formData,
      companyLocations
   }

   updateMutation.mutate(submitData)
}

   if (recruiterLoading || isLoading) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
         </div>
      )
   }

   if (!companyId) {
      return (
         <div className='flex min-h-[400px] items-center justify-center'>
            <div className='text-center'>
               <p className='text-gray-500'>Không tìm thấy công ty</p>
               <p className='mt-2 text-sm text-gray-400'>Vui lòng liên hệ quản trị viên</p>
            </div>
         </div>
      )
   }

   return (
      <div className='space-y-6'>
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
               <Building2 size={18} />
               <div className='text-xl font-semibold'>Hồ sơ công ty</div>
            </div>
            <Button type='submit' form='company-form' disabled={updateMutation.isPending}>
               {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
         </div>

         <form id='company-form' className='space-y-6' onSubmit={handleSubmit}>
            {/* Company Avatar Section */}
            <section className='rounded-md border bg-white p-6'>
               <h2 className='mb-4 text-sm font-semibold'>Logo công ty</h2>
               <div className='flex items-start gap-6'>
                  <div className='relative'>
                     <Avatar className='h-24 w-24 rounded-md'>
                        <AvatarImage src={avatarPreview} className='object-cover' />
                        <AvatarFallback className='rounded-md bg-gray-100 text-2xl'>
                           <Building2 size={32} className='text-gray-400' />
                        </AvatarFallback>
                     </Avatar>
                     {uploadLogoMutation.isPending ? (
                        <div className='absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md'>
                           <Loader2 size={14} className='animate-spin' />
                        </div>
                     ) : (
                        <label
                           htmlFor='company-avatar-upload'
                           className='absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md hover:opacity-90'
                        >
                           <Camera size={14} />
                        </label>
                     )}
                     <input
                        id='company-avatar-upload'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleAvatarChange}
                        disabled={uploadLogoMutation.isPending}
                     />
                  </div>
                  <div className='flex-1'>
                     <p className='mb-2 text-sm font-medium'>Tải lên logo công ty</p>
                     <p className='text-xs text-gray-500'>
                        JPG, PNG hoặc SVG. Kích thước tối đa 5MB. Khuyến nghị: 400x400px
                     </p>
                     {uploadLogoMutation.isPending && (
                        <p className='mt-2 text-xs text-primary'>Đang tải lên...</p>
                     )}
                  </div>
               </div>
            </section>

            <section className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Thông tin cơ bản</div>
               <div className='grid gap-4 p-4 sm:grid-cols-2'>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>
                        Tên công ty <span className='text-red-500'>*</span>
                     </label>
                     <Input 
                        placeholder='VD: Công ty TNHH ABC' 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required 
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Website</label>
                     <Input 
                        placeholder='https://example.com' 
                        type='url'
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Quy mô</label>
                     <select 
                        className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                        value={formData.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                     >
                        <option value=''>Chọn quy mô</option>
                        <option value='1-10'>1-10 nhân viên</option>
                        <option value='11-50'>11-50 nhân viên</option>
                        <option value='51-200'>51-200 nhân viên</option>
                        <option value='201-500'>201-500 nhân viên</option>
                        <option value='501-1000'>501-1000 nhân viên</option>
                        <option value='1000+'>1000+ nhân viên</option>
                     </select>
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Lĩnh vực</label>
                     <Input 
                        placeholder='IT, Công nghệ thông tin'
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                     />
                  </div>
                  <div className='sm:col-span-2'>
                     <label className='mb-1 block text-xs text-gray-600'>Mô tả</label>
                     <Textarea 
                        placeholder='Giới thiệu ngắn gọn về công ty, văn hoá, sản phẩm...' 
                        rows={5}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                     />
                  </div>
               </div>
            </section>

            {/* Multiple Locations Section */}
            <section className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Địa điểm văn phòng</div>
               <div className='space-y-4 p-4'>
                  {locations.map((location, index) => (
                     <div key={index} className='rounded-md border bg-gray-50 p-4'>
                        <div className='mb-4 flex items-center justify-between'>
                           <div className='flex items-center gap-2'>
                              <MapPin size={16} className='text-primary' />
                              <span className='text-sm font-medium'>
                                 {index === 0 ? 'Trụ sở chính' : `Văn phòng ${index + 1}`}
                              </span>
                           </div>
                           {locations.length > 1 && (
                              <button
                                 type='button'
                                 onClick={() => removeLocation(index)}
                                 className='rounded-md p-1 text-red-500 hover:bg-red-50'
                              >
                                 <X size={16} />
                              </button>
                           )}
                        </div>
                        <div className='grid gap-3 sm:grid-cols-2'>
                           <div className='sm:col-span-2'>
                              <label className='mb-1 block text-xs text-gray-600'>Số nhà, Đường</label>
                              <Input
                                 placeholder='VD: 253 Nguyễn Tri Phương'
                                 value={location.streetAddress}
                                 onChange={(e) => updateLocationField(index, 'streetAddress', e.target.value)}
                                 className='bg-white'
                              />
                           </div>
                           <div>
                              <label className='mb-1 block text-xs text-gray-600'>Phường/Xã</label>
                              <Input
                                 placeholder='VD: Phường 6'
                                 value={location.ward}
                                 onChange={(e) => updateLocationField(index, 'ward', e.target.value)}
                                 className='bg-white'
                              />
                           </div>
                           <div>
                              <label className='mb-1 block text-xs text-gray-600'>Quận/Huyện</label>
                              <Input
                                 placeholder='VD: Quận 5'
                                 value={location.district}
                                 onChange={(e) => updateLocationField(index, 'district', e.target.value)}
                                 className='bg-white'
                              />
                           </div>
                           <div>
                              <label className='mb-1 block text-xs text-gray-600'>Tỉnh/Thành phố</label>
                              <Input
                                 placeholder='VD: TP. Hồ Chí Minh'
                                 value={location.provinceCity}
                                 onChange={(e) => updateLocationField(index, 'provinceCity', e.target.value)}
                                 className='bg-white'
                              />
                           </div>
                           <div>
                              <label className='mb-1 block text-xs text-gray-600'>Quốc gia</label>
                              <Input
                                 placeholder='Việt Nam'
                                 value={location.country}
                                 onChange={(e) => updateLocationField(index, 'country', e.target.value)}
                                 className='bg-white'
                              />
                           </div>
                        </div>
                     </div>
                  ))}
                  <button
                     type='button'
                     onClick={addLocation}
                     className='flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 py-3 text-sm text-gray-600 transition-colors hover:border-primary hover:text-primary'
                  >
                     <Plus size={16} />
                     Thêm văn phòng khác
                  </button>
               </div>
            </section>

            <section className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Thông tin liên hệ</div>
               <div className='grid gap-4 p-4 sm:grid-cols-2'>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Email liên hệ</label>
                     <Input 
                        type='email' 
                        placeholder='hr@example.com'
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                     />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Số điện thoại</label>
                     <Input 
                        type='tel' 
                        placeholder='08xx xxx xxx'
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                     />
                  </div>
               </div>
            </section>
         </form>
      </div>
   )
}


