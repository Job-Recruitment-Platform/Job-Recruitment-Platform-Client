import { Body, Content, Footer, JobCard, TitleBlock, TitleContent } from '@/components/ui/job-card'
import { Skeleton } from '@/components/ui/skeleton'

export default function FeatureJobItemSkeleton() {
   return (
      <JobCard className='!min-h-[124px] bg-white border-0 !p-3'>
         <Body>
            <Skeleton className='h-[64px] w-[64px] rounded-lg' />

            <Content>
               <TitleBlock>
                  <TitleContent className='!space-y-0.5'>
                     <Skeleton className='h-4 w-full' />
                     <Skeleton className='h-4 w-3/4' />
                     <Skeleton className='h-3 w-1/2' />
                  </TitleContent>
               </TitleBlock>
            </Content>
         </Body>

         <Footer className='space-x-3'>
            <div className='flex flex-1 items-center space-x-2'>
               <Skeleton className='h-6 w-32 rounded-full' />
               <Skeleton className='h-6 flex-1 rounded-full' />
            </div>
            <Skeleton className='h-8 w-8 rounded-full' />
         </Footer>
      </JobCard>
   )
}
