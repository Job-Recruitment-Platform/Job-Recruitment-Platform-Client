import SortAdvanced from '@/components/features/search/SortAdvanced'
import Button from '@/components/shared/Button'
import { CheckIcon } from 'lucide-react'
import { useState } from 'react'

export default function BoxSearch() {
   const [selectedOption, setSelectedOption] = useState<string>('')

   const OptionButton = (title: string, value: string) => {
      return (
         <Button
            variant={selectedOption === value ? 'outline' : 'ghost'}
            className='!rounded-full !px-4 !py-1 text-left !text-sm font-medium text-gray-800/90'
            onClick={() => setSelectedOption(value)}
         >
            {selectedOption === value && <CheckIcon size={13} />}
            <span>{title}</span>
         </Button>
      )
   }

   return (
      <div className='flex w-full items-center gap-x-3'>
         <div className='pl-2 text-[15px] font-medium text-gray-800/90'>Tìm kiếm theo:</div>
         {OptionButton('Tên việc làm', 'jobTitle')}
         {OptionButton('Tên công ty', 'companyName')}
         {OptionButton('Cả hai', 'both')}
         <div className='h-[25px] w-[1px] bg-gray-800/50'></div>
         <SortAdvanced />
      </div>
   )
}
