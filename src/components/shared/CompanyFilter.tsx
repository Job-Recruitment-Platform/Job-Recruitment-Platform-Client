'use client'

import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CompanyFilter({ className = '' }: { className?: string }) {
   const router = useRouter()
   const searchParams = useSearchParams()
   const [companyName, setCompanyName] = useState('')

   useEffect(() => {
      const companyParam = searchParams.get('company') || ''
      setCompanyName(companyParam)
   }, [searchParams])

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCompanyName(e.target.value)
   }

   const handleApply = () => {
      const params = new URLSearchParams(searchParams.toString())

      if (companyName.trim()) {
         params.set('company', companyName)
      } else {
         params.delete('company')
      }

      router.push(`?${params.toString()}`)
   }

   const handleClear = () => {
      setCompanyName('')
      const params = new URLSearchParams(searchParams.toString())
      params.delete('company')
      router.push(`?${params.toString()}`)
   }

   return (
      <div className={className}>
         <div className='py-2 text-sm font-semibold'>Công ty</div>
         <div className='space-y-2 pr-2'>
            <div className='relative'>
               <Input
                  type='text'
                  placeholder='Nhập tên công ty'
                  value={companyName}
                  onChange={handleInputChange}
                  className='pr-8'
               />
               {companyName && (
                  <button
                     onClick={handleClear}
                     className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                     type='button'
                  >
                     <X size={18} />
                  </button>
               )}
            </div>
            <button
               onClick={handleApply}
               className='bg-primary w-full rounded px-3 py-1.5 text-sm text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
            >
               Tìm kiếm
            </button>
         </div>
      </div>
   )
}
