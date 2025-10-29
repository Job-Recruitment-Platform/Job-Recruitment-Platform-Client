'use client'

import Button from '@/components/shared/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { showSuccessToast } from '@/lib/toast'
import { Camera, User, Mail, Phone, MapPin, Briefcase, Upload } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function EditProfilePage() {
   const [saving, setSaving] = useState(false)
   const [avatarPreview, setAvatarPreview] = useState('https://www.topcv.vn/images/avatar-default.jpg')

   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         const reader = new FileReader()
         reader.onloadend = () => {
            setAvatarPreview(reader.result as string)
         }
         reader.readAsDataURL(file)
      }
   }

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSaving(true)
      try {
         await new Promise((r) => setTimeout(r, 1000))
         showSuccessToast('Cập nhật hồ sơ thành công')
      } finally {
         setSaving(false)
      }
   }

   return (
      <div className='min-h-screen bg-smoke py-6'>
         <div className='container mx-auto px-4'>
            <div className='mx-auto max-w-4xl'>
               <div className='mb-6 flex items-center justify-between'>
                  <div>
                     <h1 className='text-2xl font-semibold'>Chỉnh sửa hồ sơ</h1>
                     <p className='text-sm text-gray-500'>Cập nhật thông tin cá nhân của bạn</p>
                  </div>
                  <Link href='/(candidate)/profile'>
                     <Button variant='outline'>Quay lại</Button>
                  </Link>
               </div>

               <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Avatar Section */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>Ảnh đại diện</h2>
                     <div className='flex items-center gap-6'>
                        <div className='relative'>
                           <Avatar className='h-24 w-24'>
                              <AvatarImage src={avatarPreview} />
                              <AvatarFallback className='text-2xl'>NV</AvatarFallback>
                           </Avatar>
                           <label
                              htmlFor='avatar-upload'
                              className='absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:opacity-90'
                           >
                              <Camera size={16} />
                           </label>
                           <input
                              id='avatar-upload'
                              type='file'
                              accept='image/*'
                              className='hidden'
                              onChange={handleAvatarChange}
                           />
                        </div>
                        <div className='flex-1'>
                           <p className='mb-2 text-sm font-medium'>Tải ảnh đại diện của bạn</p>
                           <p className='text-xs text-gray-500'>
                              JPG, PNG hoặc GIF. Kích thước tối đa 5MB.
                           </p>
                        </div>
                     </div>
                  </section>

                  {/* Basic Information */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>Thông tin cơ bản</h2>
                     <div className='grid gap-4 sm:grid-cols-2'>
                        <div>
                           <label className='mb-1.5 flex items-center gap-2 text-sm font-medium'>
                              <User size={16} />
                              Họ và tên <span className='text-red-500'>*</span>
                           </label>
                           <Input
                              placeholder='Nguyễn Văn A'
                              defaultValue='Nguyễn Văn A'
                              required
                           />
                        </div>
                        <div>
                           <label className='mb-1.5 flex items-center gap-2 text-sm font-medium'>
                              <Mail size={16} />
                              Email <span className='text-red-500'>*</span>
                           </label>
                           <Input
                              type='email'
                              placeholder='nguyenvana@email.com'
                              defaultValue='nguyenvana@email.com'
                              required
                           />
                        </div>
                        <div>
                           <label className='mb-1.5 flex items-center gap-2 text-sm font-medium'>
                              <Phone size={16} />
                              Số điện thoại <span className='text-red-500'>*</span>
                           </label>
                           <Input
                              type='tel'
                              placeholder='0912345678'
                              defaultValue='0912345678'
                              required
                           />
                        </div>
                        <div>
                           <label className='mb-1.5 flex items-center gap-2 text-sm font-medium'>
                              <MapPin size={16} />
                              Địa chỉ
                           </label>
                           <Input placeholder='TP. Hồ Chí Minh' />
                        </div>
                     </div>
                  </section>

                  {/* Professional Information */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>Thông tin nghề nghiệp</h2>
                     <div className='space-y-4'>
                        <div>
                           <label className='mb-1.5 flex items-center gap-2 text-sm font-medium'>
                              <Briefcase size={16} />
                              Chức danh hiện tại
                           </label>
                           <Input placeholder='Frontend Developer' />
                        </div>
                        <div className='grid gap-4 sm:grid-cols-2'>
                           <div>
                              <label className='mb-1.5 block text-sm font-medium'>
                                 Kinh nghiệm
                              </label>
                              <select className='h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'>
                                 <option value=''>Chọn số năm kinh nghiệm</option>
                                 <option value='0'>Chưa có kinh nghiệm</option>
                                 <option value='1'>1 năm</option>
                                 <option value='2'>2 năm</option>
                                 <option value='3'>3 năm</option>
                                 <option value='4'>4 năm</option>
                                 <option value='5'>5+ năm</option>
                              </select>
                           </div>
                           <div>
                              <label className='mb-1.5 block text-sm font-medium'>
                                 Mức lương mong muốn
                              </label>
                              <Input type='number' placeholder='15000000' />
                           </div>
                        </div>
                        <div>
                           <label className='mb-1.5 block text-sm font-medium'>Kỹ năng</label>
                           <Input placeholder='React, Node.js, TypeScript...' />
                           <p className='mt-1 text-xs text-gray-500'>
                              Nhập các kỹ năng, cách nhau bằng dấu phẩy
                           </p>
                        </div>
                     </div>
                  </section>

                  {/* About Me */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>Giới thiệu bản thân</h2>
                     <Textarea
                        placeholder='Viết một đoạn giới thiệu ngắn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp của bạn...'
                        rows={6}
                     />
                  </section>

                  {/* Resume Upload */}
                  <section className='rounded-lg border bg-white p-6'>
                     <h2 className='mb-4 text-lg font-semibold'>CV / Resume</h2>
                     <div className='flex items-center gap-4'>
                        <label
                           htmlFor='resume-upload'
                           className='flex cursor-pointer items-center gap-2 rounded-md border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10'
                        >
                           <Upload size={16} />
                           Tải lên CV
                        </label>
                        <input
                           id='resume-upload'
                           type='file'
                           accept='.pdf,.doc,.docx'
                           className='hidden'
                        />
                        <span className='text-sm text-gray-500'>
                           Chưa có file nào được chọn
                        </span>
                     </div>
                     <p className='mt-2 text-xs text-gray-500'>
                        Chấp nhận file PDF, DOC, DOCX. Kích thước tối đa 10MB.
                     </p>
                  </section>

                  {/* Action Buttons */}
                  <div className='flex items-center justify-end gap-3'>
                     <Link href='/(candidate)/profile'>
                        <Button type='button' variant='outline' disabled={saving}>
                           Hủy
                        </Button>
                     </Link>
                     <Button type='submit' variant='primary' disabled={saving}>
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}

