'use client'

import { Input } from '@/components/ui/input'
import RadioFilter from '@/components/ui/radio-filter'
import { currencyOptions } from '@/types/data'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SalaryFilter({ className = '' }: { className?: string }) {
   const router = useRouter()
   const searchParams = useSearchParams()

   const [customMin, setCustomMin] = useState('')
   const [customMax, setCustomMax] = useState('')
   const [currency, setCurrency] = useState('')

   useEffect(() => {
      const minParam = searchParams.get('salary_min')
      const maxParam = searchParams.get('salary_max')
      const currencyParam = searchParams.get('currency') || 'VND'

      setCustomMin(minParam || '')
      setCustomMax(maxParam || '')
      setCurrency(currencyParam)
   }, [searchParams])

   const handleCustomApply = () => {
      const params = new URLSearchParams(searchParams.toString())

      params.delete('salary_min')
      params.delete('salary_max')
      params.delete('currency')

      if (customMin && customMax) {
         params.set('salary_min', customMin)
         params.set('salary_max', customMax)
         params.set('currency', currency)
      }

      router.push(`?${params.toString()}`)
   }

   const isCustomInputValid = () => {
      if (!customMin || !customMax) return false
      const min = Number(customMin)
      const max = Number(customMax)
      return !isNaN(min) && !isNaN(max) && min < max
   }

   return (
      <div className={className}>
         <div className='space-y-3'>
            <RadioFilter
               header='Đơn vị tiền tệ'
               options={currencyOptions}
               paramKey='currency'
               onValueChange={(value) => {
                  if (value === 'all') {
                     const params = new URLSearchParams(searchParams.toString())
                     params.delete('salary_min')
                     params.delete('salary_max')
                     params.delete('currency')
                     setCustomMin('')
                     setCustomMax('')
                     router.push(`?${params.toString()}`)
                  } else {
                     setCurrency(value)
                  }
               }}
            />

            <div className='space-y-2 pr-2'>
               <div className='flex items-center gap-2'>
                  <Input
                     type='text'
                     inputMode='numeric'
                     pattern='[0-9]*'
                     placeholder='Từ'
                     value={customMin}
                     onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || /^\d+$/.test(value)) {
                           setCustomMin(value)
                        }
                     }}
                     className='flex-1'
                  />
                  <span className='text-sm'>-</span>
                  <Input
                     type='text'
                     inputMode='numeric'
                     pattern='[0-9]*'
                     placeholder='Đến'
                     value={customMax}
                     onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || /^\d+$/.test(value)) {
                           setCustomMax(value)
                        }
                     }}
                     className='flex-1'
                  />
               </div>
               <button
                  onClick={handleCustomApply}
                  disabled={!isCustomInputValid()}
                  className='bg-primary w-full rounded px-3 py-1.5 text-sm text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
               >
                  Áp dụng
               </button>
            </div>
         </div>
      </div>
   )
}
