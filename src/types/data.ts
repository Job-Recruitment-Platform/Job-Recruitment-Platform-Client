import { JobType } from '@/types/job.type'
import { OptionType } from '@/types/option.type'

export const experienceOptions: OptionType[] = [
   { label: '1 Năm', value: '1' },
   { label: '2 Năm', value: '2' },
   { label: '3 Năm', value: '3' },
   { label: '4 Năm', value: '4' },
   { label: '5 Năm', value: '5' },
   { label: '6 Năm', value: '6' },
   { label: '7 Năm', value: '7' },
   { label: '8 Năm', value: '8' },
   { label: '9 Năm', value: '9' },
   { label: '10 Năm', value: '10' }
]

export const jobMockData: JobType = {
   id: 1,
   title: 'Business Analyst (Yêu Cầu Tốt Nghiệp MBA)',
   logo: 'https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-tnhh-asel-vietnam-1ae0e8338c0b51e18033c75796ab676b-658554411fd42.jpg',
   company: 'ABC Company',
   location: 'Hà Nội',
   salary: '15 - 25 triệu'
}
