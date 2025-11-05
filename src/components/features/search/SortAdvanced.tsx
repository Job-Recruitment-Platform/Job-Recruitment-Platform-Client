import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type SortOption = {
   label: string
   value: string
}

const sortOptions: SortOption[] = [
   { label: 'Ngày cập nhật', value: 'date-updated' },
   { label: 'Lương cao đến thấp', value: 'salary-high-to-low' },
   { label: 'Cần tuyển gấp', value: 'urgent-hiring' }
]

export default function SortAdvanced() {
   const [sortValue, setSortValue] = useState('')

   return (
      <div className='flex flex-1 items-center gap-x-2 text-[15px] font-medium text-gray-800/90'>
         <div>Săp xếp theo</div>
         <Select value={sortValue} onValueChange={setSortValue}>
            <SelectTrigger className='hover:border-primary flex-1 rounded-full'>
               <SelectValue placeholder='Chọn một tiêu chí' />
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                  {sortOptions.map((option) => (
                     <SelectItem
                        key={option.value}
                        className={cn('hover:text-primary py-2.5', {
                           'text-primary': sortValue === option.value
                        })}
                        value={option.value}
                     >
                        <span>{option.label}</span>
                     </SelectItem>
                  ))}
               </SelectGroup>
            </SelectContent>
         </Select>
      </div>
   )
}
