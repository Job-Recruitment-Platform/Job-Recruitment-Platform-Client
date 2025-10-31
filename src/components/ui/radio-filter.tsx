'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { OptionType } from '@/types/option.type'
import { useRouter, useSearchParams } from 'next/navigation'

type RadioFilterProps = {
   header: string
   className?: string
   columns?: 1 | 2
   options: OptionType[]
   paramKey: string
}

export default function RadioFilter({
   className = '',
   columns = 1,
   options,
   header,
   paramKey
}: RadioFilterProps) {
   const router = useRouter()
   const searchParams = useSearchParams()
   const currentValue = searchParams.get(paramKey) || ''

   const handleChange = (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === '') {
         params.delete(paramKey)
      } else {
         params.set(paramKey, value)
      }

      router.push(`?${params.toString()}`)
   }

   const renderOption = (option: OptionType) => (
      <div key={option.value} className='flex items-center gap-x-2'>
         <RadioGroupItem className='border-2' value={option.value} id={option.value} />
         <Label className='cursor-pointer text-black/70' htmlFor={option.value}>
            {option.label}
         </Label>
      </div>
   )

   const renderSingleColumn = () => <div className='space-y-3'>{options.map(renderOption)}</div>

   const renderTwoColumns = () => {
      const half = Math.ceil(options.length / 2)
      const leftColumn = options.slice(0, half)
      const rightColumn = options.slice(half)

      return (
         <div className='grid w-fit grid-cols-2 gap-x-10'>
            <div className='space-y-3'>{leftColumn.map(renderOption)}</div>
            <div className='space-y-3'>{rightColumn.map(renderOption)}</div>
         </div>
      )
   }

   return (
      <div className={className}>
         <div className='py-3 text-sm font-semibold'>{header}</div>
         <RadioGroup value={currentValue} onValueChange={handleChange}>
            {columns === 1 ? renderSingleColumn() : renderTwoColumns()}
         </RadioGroup>
      </div>
   )
}
