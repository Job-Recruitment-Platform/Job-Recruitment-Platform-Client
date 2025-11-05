'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type SalaryOption = {
   label: string
   value: string // 'all' | 'under-10' | '10-15' | '15-20' | '20-25' | '25-30' | '30-50' | 'over-50' | 'custom'
   min?: number
   max?: number
}

const salaryOptions: SalaryOption[] = [
   { label: 'Tất cả', value: 'all' },
   { label: 'Dưới 10 triệu', value: 'under-10', max: 10 },
   { label: '10 - 15 triệu', value: '10-15', min: 10, max: 15 },
   { label: '15 - 20 triệu', value: '15-20', min: 15, max: 20 },
   { label: '20 - 25 triệu', value: '20-25', min: 20, max: 25 },
   { label: '25 - 30 triệu', value: '25-30', min: 25, max: 30 },
   { label: '30 - 50 triệu', value: '30-50', min: 30, max: 50 },
   { label: 'Trên 50 triệu', value: 'over-50', min: 50 },
   { label: 'Tùy chỉnh', value: 'custom' }
]

export default function SalaryFilter({ className = '' }: { className?: string }) {
   const router = useRouter()
   const searchParams = useSearchParams()

   const [customMin, setCustomMin] = useState('')
   const [customMax, setCustomMax] = useState('')
   const [selectedOption, setSelectedOption] = useState('all')

   // Đọc params từ URL khi component mount
   useEffect(() => {
      const minParam = searchParams.get('salary_min')
      const maxParam = searchParams.get('salary_max')

      if (!minParam && !maxParam) {
         setSelectedOption('all')
         return
      }

      // Tìm option match với params
      const matchedOption = salaryOptions.find((opt) => {
         if (opt.value === 'all') return false
         const minMatch = opt.min === undefined || opt.min === Number(minParam)
         const maxMatch = opt.max === undefined || opt.max === Number(maxParam)
         return minMatch && maxMatch
      })

      if (matchedOption) {
         setSelectedOption(matchedOption.value)
      } else {
         // Custom range
         setSelectedOption('custom')
         setCustomMin(minParam || '')
         setCustomMax(maxParam || '')
      }
   }, [searchParams])

   const updateParams = (option: SalaryOption) => {
      const params = new URLSearchParams(searchParams.toString())

      // Xóa tất cả salary params cũ
      params.delete('salary_min')
      params.delete('salary_max')

      if (option.value === 'all') {
         // Không làm gì, đã xóa hết params
      } else {
         if (option.min !== undefined) {
            params.set('salary_min', String(option.min))
         }
         if (option.max !== undefined) {
            params.set('salary_max', String(option.max))
         }
      }

      router.push(`?${params.toString()}`)
   }

   const handleOptionChange = (value: string) => {
      setSelectedOption(value)

      if (value === 'custom') {
         // Không update params ngay, đợi user nhập số
         return
      }

      const option = salaryOptions.find((opt) => opt.value === value)
      if (option) {
         updateParams(option)
      }
   }

   const handleCustomApply = () => {
      const params = new URLSearchParams(searchParams.toString())

      params.delete('salary_min')
      params.delete('salary_max')

      if (customMin) {
         params.set('salary_min', customMin)
      }
      if (customMax) {
         params.set('salary_max', customMax)
      }

      router.push(`?${params.toString()}`)
   }

   // Validate custom inputs
   const isCustomInputValid = () => {
      if (!customMin || !customMax) return false
      const min = Number(customMin)
      const max = Number(customMax)
      if (isNaN(min) || isNaN(max)) return false
      return min < max
   }

   const renderOption = (option: SalaryOption) => (
      <div key={option.value} className='flex items-center gap-x-2'>
         <RadioGroupItem className='border-2' value={option.value} id={option.value} />
         <Label className='cursor-pointer text-black/70' htmlFor={option.value}>
            {option.label}
         </Label>
      </div>
   )

   const renderTwoColumns = () => {
      const half = Math.ceil(salaryOptions.length / 2)
      const leftColumn = salaryOptions.slice(0, half)
      const rightColumn = salaryOptions.slice(half)

      return (
         <div className='grid w-fit grid-cols-2 gap-x-10'>
            <div className='space-y-3'>{leftColumn.map(renderOption)}</div>
            <div className='space-y-3'>{rightColumn.map(renderOption)}</div>
         </div>
      )
   }

   return (
      <div className={className}>
         <div className='pb-2 text-sm font-semibold'>Mức lương</div>
         <RadioGroup value={selectedOption} onValueChange={handleOptionChange}>
            {renderTwoColumns()}

            {/* Custom range inputs */}
            {selectedOption === 'custom' && (
               <div className='mt-3 space-y-2 px-2'>
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
                        className='w-20'
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
                        className='w-20'
                     />
                     <span className='text-sm text-black/70'>triệu</span>
                  </div>
                  <button
                     onClick={handleCustomApply}
                     disabled={!isCustomInputValid()}
                     className='bg-primary w-full rounded px-3 py-1.5 text-sm text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                     Áp dụng
                  </button>
               </div>
            )}
         </RadioGroup>
      </div>
   )
}
