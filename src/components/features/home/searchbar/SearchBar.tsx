'use client'

import Button from '@/components/shared/Button'
import CategorySelection from '@/components/shared/CategorySelection'
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

   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!keyword.trim()) return
      // Navigate to search page with query parameter
      const searchParams = new URLSearchParams({
         key_word: keyword.trim()
      })
      router.push(`/search?${searchParams.toString()}`)
   }

   return (
      <form
         onSubmit={handleSearch}
         className={`my-5 flex w-full items-stretch gap-x-2 rounded-full bg-white p-2 ${className}`}
      >
         <CategorySelection />
         <div className='flex flex-1 items-center border-x px-2'>
            <input
               type='text'
               placeholder='Vị trí tuyển dụng, tên công ty'
               className='h-[35px] w-full text-black outline-none'
               value={keyword}
               onChange={(e) => setKeyword(e.target.value)}
            />
         </div>
         <MultiLocationSelection />
         <Button variant='primary' className='rounded-full px-5 py-2' type='submit'>
            <SearchIcon size={16} />
            <span>Tìm kiếm</span>
         </Button>
      </form>
   )
}
