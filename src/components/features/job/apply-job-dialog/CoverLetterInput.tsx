'use client'

import { CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CoverLetterInputProps {
   value: string
   onChange: (value: string) => void
   maxLength?: number
}

export default function CoverLetterInput({
   value,
   onChange,
   maxLength = 500
}: CoverLetterInputProps) {
   const [charCount, setCharCount] = useState(value.length)
   const [isValid, setIsValid] = useState(value.length > 0)

   useEffect(() => {
      setCharCount(value.length)
   }, [value])

   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value.slice(0, maxLength)
      onChange(newValue)
      setIsValid(newValue.length > 0)
   }

   return (
      <div className='space-y-3 border-t pt-4'>
         <div className='flex items-start gap-2'>
            <div className='mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-sm text-white'>
               🍃
            </div>
            <h3 className='font-semibold text-gray-800'>Thư giới thiệu:</h3>
         </div>

         <p className='pl-8 text-sm text-gray-600'>
            Một thu giới thiệu ngắn gọn, chính chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng
            hơn với nhà tuyển dụng.
         </p>

         <div className='pl-8'>
            <div className='relative'>
               <textarea
                  value={value}
                  onChange={handleChange}
                  placeholder='Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nếu rõ muốn lý do bạn muốn ứng tuyển cho vị trí này.'
                  className='w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none'
                  rows={4}
                  maxLength={maxLength}
               />
               <div className='absolute right-3 bottom-3 text-xs text-gray-500'>
                  {charCount}/{maxLength}
               </div>
               {isValid && (
                  <div className='absolute top-2 right-3 text-green-500'>
                     <CheckCircle size={20} />
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
