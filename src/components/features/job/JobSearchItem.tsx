import Button from '@/components/shared/Button'
import { Badge } from '@/components/ui/badge'
import {
   Actions,
   Body,
   Company,
   Content,
   JobCard,
   JobTitle,
   Logo,
   Meta,
   Salary,
   TitleBlock,
   TitleContent
} from '@/components/ui/job-card'
import { EyeOffIcon, HeartIcon } from 'lucide-react'

export default function JobSearchItem() {
   return (
      <JobCard>
         <Body>
            <Logo src='/logo512.png' alt='Company Logo' className='h-12 w-12' />
            <Content>
               <TitleBlock>
                  <TitleContent>
                     <JobTitle>Business Analyst (Yêu Cầu Tốt Nghiệp MBA)</JobTitle>
                     <Company>ABC Company</Company>
                     <Meta>
                        <Badge variant='outline'>Hà Nội</Badge>
                        <Badge variant='outline'>1 Năm</Badge>
                     </Meta>
                  </TitleContent>
                  <Salary>15 - 25 triệu</Salary>
               </TitleBlock>
               <Actions className='gap-x-2'>
                  <div className='flex-1'></div>
                  <div className='flex items-center gap-x-3'>
                     <Button
                        variant='primary'
                        className='hidden rounded-full px-4 !py-[4px] group-hover:block'
                     >
                        Ứng tuyển
                     </Button>
                     <Button variant='ghost' className='group-hover:block hidden rounded-full border bg-white !p-1.5'>
                        <EyeOffIcon color='gray' size={16} />
                     </Button>
                     <Button variant='outline' className='rounded-full !p-1.5'>
                        <HeartIcon size={16} />
                     </Button>
                  </div>
               </Actions>
            </Content>
         </Body>
      </JobCard>
   )
}
