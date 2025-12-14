'use client'

import Button from '@/components/shared/Button'
import MultiLocationSelection from '@/components/shared/MultiLocationSelection'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function OptionSearchJob() {
   const router = useRouter()
   const [searchInput, setSearchInput] = useState('')
   const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

   const handleSearch = () => {
      const params = new URLSearchParams()

      if (searchInput.trim()) {
         params.append('query', searchInput.trim())
      }

      if (selectedLocation) {
         params.append('location', selectedLocation)
      }

      if (params.toString()) {
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
            {/* <CategorySelection className='border-0 !text-black' /> */}
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

            <MultiLocationSelection
               selectedLocation={selectedLocation}
               onLocationChange={setSelectedLocation}
            />
            
         </div>
         <Button variant='primary' className='min-w-[100px]' onClick={handleSearch}>
            Tìm kiếm
         </Button>
      </div>
   )
}
