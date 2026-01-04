import {
   Actions,
   Body,
   Content,
   JobCard,
   Meta,
   TitleBlock,
   TitleContent
} from '@/components/ui/job-card'
import { Skeleton } from '@/components/ui/skeleton'

export default function JobSearchItemSkeleton() {
   return (
      <JobCard className='border-0 !bg-white !pointer-events-none'>
         <Body>
            {/* Logo skeleton */}
            <Skeleton className='h-[120px] w-[120px] rounded-lg' />

            <Content>
               <TitleBlock>
                  <TitleContent>
                     {/* Job title skeleton */}
                     <Skeleton className='h-5 w-3/4' />
                     {/* Company name skeleton */}
                     <Skeleton className='mt-2 h-4 w-1/2' />
                     {/* Meta badges skeleton */}
                     <Meta>
                        <Skeleton className='h-6 w-24 rounded-full' />
                        <Skeleton className='h-6 w-32 rounded-full' />
                     </Meta>
                  </TitleContent>
                  {/* Salary skeleton */}
                  <Skeleton className='h-6 w-32' />
               </TitleBlock>

               <Actions className='gap-x-2'>
                  <div className='flex-1' />
                  <div className='flex items-center gap-x-3'>
                     {/* Buttons skeleton */}
                     <Skeleton className='h-8 w-8 rounded-full' />
                  </div>
               </Actions>
            </Content>
         </Body>
      </JobCard>
   )
}
