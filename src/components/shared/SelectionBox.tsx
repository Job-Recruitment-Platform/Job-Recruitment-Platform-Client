'use client'

import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select'
import { OptionType } from '@/types/option.type'
import { useRouter, useSearchParams } from 'next/navigation'

type SelectionBoxProps = {
   header?: string
   className?: string
   options: OptionType[]
   paramKey: string
   placeholder?: string
   onValueChange?: (value: string) => void
}

export default function SelectionBox({
   header = 'Lựa chọn',
   options,
   onValueChange,
   paramKey,
   placeholder = 'Chọn một tiêu chí',
   className = ''
}: SelectionBoxProps) {
   const router = useRouter()
   const searchParams = useSearchParams()
   const currentValue = searchParams.get(paramKey) || ''

   const handleChange = (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      onValueChange?.(value)

      if (value === 'all' || value === '') {
         params.delete(paramKey)
      } else {
         params.set(paramKey, value)
      }

      router.push(`?${params.toString()}`)
   }

   return (
      <div className={className}>
         <div className='py-2 text-sm font-semibold'>{header}</div>
         <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger className='hover:border-primary w-full flex-1 rounded-full'>
               <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
               <SelectGroup className='max-h-60'>
                  {options.map((option) => (
                     <SelectItem key={option.value} value={option.value}>
                        <span>{option.label}</span>
                     </SelectItem>
                  ))}
               </SelectGroup>
            </SelectContent>
         </Select>
      </div>
   )
}
