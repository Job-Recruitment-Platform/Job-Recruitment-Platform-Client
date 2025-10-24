import { JobDetail } from '@/types/job.type'
import { BoxIcon, ExternalLink, MapPin, UsersIcon } from 'lucide-react'

type JobCompanyInfoProps = {
   job: JobDetail
}

export default function JobCompanyInfo({ job }: JobCompanyInfoProps) {
   return (
      <div className='w-full rounded-lg bg-white px-6 py-5'>
         <div className='flex items-start gap-3'>
            <div className='h-[88px] w-[88px] shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white p-2'>
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
                  src={
                     'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/cong-ty-tai-chinh-tnhh-mtv-mirae-asset-57d9002332f00_rs.jpg'
                  }
                  alt={`Logo ${''}`}
                  className='h-full w-full object-contain'
               />
            </div>
            <div className='line-clamp-2 text-[16px] leading-6 font-semibold text-black/90'>{job.company}</div>
         </div>

         <div className='mt-3 space-y-3.5 text-sm'>
            <div className='flex items-center gap-2 text-gray-600'>
               <UsersIcon size={16} fill='gray' />
               <span>Quy mô:</span>
               <span className='truncate font-medium text-black'>{'100+ nhân viên'}</span>
            </div>

            <div className='flex items-center gap-2 text-gray-600'>
               <BoxIcon size={16} />
               <div>Lĩnh vực:</div>
               <div className='truncate font-medium text-black'>{'Tài chính'}</div>
            </div>

            <div className='flex items-start gap-2 text-gray-600'>
               <MapPin size={22} />
               <div className='min-w-[59px]'>Địa điểm:</div>
               <div className='line-clamp-2 font-medium text-black'>{job.location}</div>
            </div>
         </div>

         <div className='mt-3 flex w-full justify-center'>
            <a
               href='#'
               target='_blank'
               rel='noopener noreferrer'
               className='text-primary-green inline-flex items-center gap-2 text-[14.5px] font-semibold hover:underline'
            >
               Xem trang công ty
               <ExternalLink size={16} />
            </a>
         </div>
      </div>
   )
}
