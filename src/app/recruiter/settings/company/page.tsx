'use client'

import Button from '@/components/shared/Button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { showSuccessToast } from '@/lib/toast'
import { Building2 } from 'lucide-react'
import { useState } from 'react'

export default function RecruiterCompanySettingsPage() {
   const [saving, setSaving] = useState(false)

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSaving(true)
      try {
         await new Promise((r) => setTimeout(r, 800))
         showSuccessToast('Lưu hồ sơ công ty thành công')
      } finally {
         setSaving(false)
      }
   }

   return (
      <div className='space-y-6'>
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
               <Building2 size={18} />
               <div className='text-xl font-semibold'>Hồ sơ công ty</div>
            </div>
            <Button type='submit' form='company-form' disabled={saving}>
               {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
         </div>

         <form id='company-form' className='space-y-6' onSubmit={handleSubmit}>
            <section className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Thông tin cơ bản</div>
               <div className='grid gap-4 p-4 sm:grid-cols-2'>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Tên công ty</label>
                     <Input placeholder='VD: Công ty TNHH ABC' required />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Website</label>
                     <Input placeholder='https://example.com' type='url' />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Địa chỉ</label>
                     <Input placeholder='Số 1, Đường A, Quận B, TP. HCM' />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Quy mô</label>
                     <Input placeholder='50-200 nhân sự' />
                  </div>
                  <div className='sm:col-span-2'>
                     <label className='mb-1 block text-xs text-gray-600'>Mô tả</label>
                     <Textarea placeholder='Giới thiệu ngắn gọn về công ty, văn hoá, sản phẩm...' rows={5} />
                  </div>
               </div>
            </section>

            <section className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Thông tin liên hệ</div>
               <div className='grid gap-4 p-4 sm:grid-cols-2'>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Email liên hệ</label>
                     <Input type='email' placeholder='hr@example.com' />
                  </div>
                  <div>
                     <label className='mb-1 block text-xs text-gray-600'>Số điện thoại</label>
                     <Input type='tel' placeholder='08xx xxx xxx' />
                  </div>
               </div>
            </section>
         </form>
      </div>
   )
}


