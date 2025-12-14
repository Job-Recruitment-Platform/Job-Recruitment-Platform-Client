'use client'

import Button from '@/components/shared/Button'
import MultiLocationSelection from '@/components/shared/MultiLocationSelection'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type SearchBarProps = {
   className?: string
}

export default function SearchBar({ className }: SearchBarProps) {
   const router = useRouter()
   const [keyword, setKeyword] = useState('')
   const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const searchParams = new URLSearchParams()

      if (keyword.trim()) {
         searchParams.set('query', keyword.trim())
      }

      if (selectedLocation) {
         searchParams.set('location', selectedLocation)
      }

      // Only navigate if there's at least one param
      if (searchParams.toString()) {
         router.push(`/search?${searchParams.toString()}`)
      }
   }

   return (
      <form
         onSubmit={handleSearch}
         className={`my-5 flex w-full items-stretch gap-x-2 rounded-full bg-white p-2 ${className}`}
      >
         {/* <CategorySelection /> */}
         <div className='flex flex-1 items-center border-r px-2'>
            <input
               type='text'
               placeholder='Vị trí tuyển dụng, tên công ty'
               className='h-[35px] w-full border-none pl-3 text-black outline-none'
               value={keyword}
               onChange={(e) => setKeyword(e.target.value)}
            />
         </div>

         <MultiLocationSelection
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
         />

         <Button variant='primary' className='rounded-full px-5 py-2' type='submit'>
            <SearchIcon size={16} />
            <span>Tìm kiếm</span>
         </Button>
      </form>
   )
}
