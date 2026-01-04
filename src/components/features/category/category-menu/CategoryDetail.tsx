'use client'

import { JobFamily, SubFamily } from '@/types/job-category.type'
import { useRouter } from 'next/navigation'
import React from 'react'

type CategoryDetailProps = {
   category: JobFamily | null
}

export default function CategoryDetail({ category }: CategoryDetailProps) {
   const router = useRouter()

   const handleJobRoleClick = (jobRoleName: string) => {
      router.push(`/search?jobRole=${encodeURIComponent(jobRoleName)}`)
   }

   if (!category) {
      return (
         <div className='flex h-full w-full items-center justify-center rounded-md bg-white'>
            <img
               src='https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/banners/70JMzq6wtsE9olC5DGHSoViPXeqFt1PB_1765247587____2cabb4d369fceb34a213e7049f115877.jpg'
               alt='Banner'
               className='h-full w-full rounded-md object-cover'
            />
         </div>
      )
   }

   return (
      <div className='flex h-full w-full flex-col overflow-y-auto rounded-md bg-white p-4'>
         <div className='grid grid-cols-[auto_1fr] gap-y-3'>
            {category.subFamilies.map((subFamily: SubFamily) => (
               <React.Fragment key={subFamily.id}>
                  {/* SubFamily - Cột trái */}
                  <div className='flex items-start border-b border-gray-100 py-2 pr-5'>
                     <h3 className='text-primary text-sm font-semibold'>{subFamily.name}</h3>
                  </div>
                  {/* JobRoles - Cột phải */}
                  <div className='flex flex-wrap items-center gap-2 border-b border-gray-100 py-2'>
                     {subFamily.jobRoles.map((jobRole) => (
                        <span
                           key={jobRole.id}
                           onClick={() => handleJobRoleClick(jobRole.name)}
                           className='hover:border-primary hover:text-primary cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs whitespace-nowrap text-gray-700 transition-colors'
                        >
                           {jobRole.name}
                        </span>
                     ))}
                  </div>
               </React.Fragment>
            ))}
         </div>
         {/* Scroll hint */}
         {category.subFamilies.length > 4 && (
            <div className='text-primary mt-auto pt-2 text-right text-xs'>↓ Cuộn để xem</div>
         )}
      </div>
   )
}
