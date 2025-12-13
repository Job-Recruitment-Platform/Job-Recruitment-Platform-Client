import Button from '@/components/shared/Button'
import { Badge } from '@/components/ui/badge'
import {
   Body,
   Company,
   Content,
   Footer,
   JobCard,
   JobTitle,
   Logo,
   TitleBlock,
   TitleContent
} from '@/components/ui/job-card'
import { JobResponse } from '@/types/job.type'
import { HeartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

type FeatureJobItemProps = {
   job: JobResponse
}

export default function FeatureJobItem({ job }: FeatureJobItemProps) {
   // use hooks
   const router = useRouter()

   // another func
   const handleTitleClick = () => {
      router.push(`/job/${job.id}/detail`)
   }

   return (
      <JobCard className='!min-h-[124px] bg-white !p-3'>
         <Body>
            <Logo className='h-[64px] w-[64px]' src={job.company} />
            <Content>
               <TitleBlock>
                  <TitleContent className='line-clamp-1 !space-y-0.5'>
                     <JobTitle
                        className='line-clamp-2 cursor-pointer text-sm font-semibold text-wrap hover:underline'
                        onClick={handleTitleClick}
                     >
                        {job.title}
                     </JobTitle>
                     <Company className='text-xs text-gray-500'>{job.company}</Company>
                  </TitleContent>
               </TitleBlock>
            </Content>
         </Body>
         <Footer className='space-x-3'>
            <div className='flex flex-1 items-center space-x-2'>
               <Badge variant='outline'>
                  {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}{' '}
                  {job.currency}
               </Badge>
               {job.location && (
                  <span className='line-clamp-1 flex-1 rounded-full bg-[#eaecef] px-2 py-0.5 text-xs font-medium'>
                     {job.location}
                  </span>
               )}
            </div>
            <Button variant='outline' className='rounded-full !p-1.5'>
               <HeartIcon size={10} />
            </Button>
         </Footer>
      </JobCard>
   )
}
