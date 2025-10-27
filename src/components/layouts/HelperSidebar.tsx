'use client'

import Button from '@/components/shared/Button'
import { useSavedJobsStore } from '@/store/useSavedJobStore'
import { HeadsetIcon, HeartIcon, ShieldCheckIcon, UserRoundPlusIcon } from 'lucide-react'

export default function HelperSidebar() {
   const { jobs } = useSavedJobsStore()

   return (
      <div className='flex flex-col items-center space-y-2'>
         <Button
            variant='outline'
            className='relative h-[40px] w-[40px] !rounded-full border-0 bg-white !p-0'
         >
            <HeartIcon size={20} fill='#00b14f' />
            <div className='bg-primary absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 rounded-full text-center h-[15px] w-[15px] text-[10px] text-white'>
               {jobs.length}
            </div>
         </Button>

         <Button
            variant='outline'
            className='h-[40px] w-[40px] !rounded-full border-0 bg-white !p-0'
         >
            <UserRoundPlusIcon size={20} fill='#00b14f' />
         </Button>

         <Button
            variant='outline'
            className='h-[40px] w-[40px] !rounded-full border-0 bg-white !p-0'
         >
            <ShieldCheckIcon size={20} color='white' fill='#00b14f' />
         </Button>

         <div className='space-y-2 rounded-md bg-white p-1.5 hover:cursor-pointer'>
            <div className='text-primary flex flex-col items-center gap-1 text-[10px]'>
               <UserRoundPlusIcon size={20} color='#00b14f' />
               <div>Góp ý</div>
            </div>
            <div className='text-primary flex flex-col items-center gap-1 text-[10px]'>
               <HeadsetIcon size={20} color='#00b14f' />
               <div>Hỗ trợ</div>
            </div>
         </div>
      </div>
   )
}
