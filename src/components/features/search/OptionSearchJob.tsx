import Button from '@/components/shared/Button'
import CategorySelection from '@/components/shared/CategorySelection'
import MultiLocationSelection from '@/components/shared/MultiLocationSelection'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function OptionSearchJob() {
   const router = useRouter()
   const [searchInput, setSearchInput] = useState('')

   const handleSearch = () => {
      if (searchInput.trim()) {
         const params = new URLSearchParams()
         params.append('key_word', searchInput.trim())
         router.push(`/search?${params.toString()}`)
      }
   }

   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         handleSearch()
      }
   }

   return (
      <div className='flex w-full items-stretch gap-x-2'>
         <div className='flex w-full items-center rounded bg-white'>
            <CategorySelection className='border-0 !text-black' />
            <div className='flex flex-1 items-center gap-x-3 border-x px-2'>
               <SearchIcon size={15} />
               <input
                  type='text'
                  className='w-full text-[15px] outline-none'
                  placeholder='Vị trí tuyển dụng'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
               />
            </div>

            <MultiLocationSelection />
         </div>
         <Button variant='primary' className='min-w-[100px]' onClick={handleSearch}>
            Tìm kiếm
         </Button>
      </div>
   )
}
