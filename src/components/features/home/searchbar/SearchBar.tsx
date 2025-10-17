import Button from '@/components/shared/Button'
import CategorySelection from '@/components/shared/CategorySelection'
import MultiLocationSelection from '@/components/shared/MultiLocationSelection'
import { SearchIcon } from 'lucide-react'

type SearchBarProps = {
   className?: string
}

export default function SearchBar({ className }: SearchBarProps) {
   return (
      <div
         className={`my-5 flex w-full items-stretch gap-x-2 rounded-full bg-white p-2 ${className}`}
      >
         <CategorySelection />
         <div className='flex flex-1 items-center border-x px-2'>
            <input
               type='text'
               placeholder='Vị trí tuyển dụng, tên công ty'
               className='h-[35px] w-full text-black outline-none'
            />
         </div>
         <MultiLocationSelection />
         <Button variant='primary' className='rounded-full px-5 py-2'>
            <SearchIcon size={16} />
            <span>Tìm kiếm</span>
         </Button>
      </div>
   )
}
