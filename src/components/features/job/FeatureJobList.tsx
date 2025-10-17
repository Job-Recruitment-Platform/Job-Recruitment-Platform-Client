import FeatureJobItem from '@/components/features/job/FeatureJobItem'
import { jobMockData } from '@/types/data'

export default function FeatureJobList() {
   return (
      <div className='container grid grid-cols-3 gap-4'>
         {Array.from({ length: 12 }).map((_, index) => (
            <FeatureJobItem key={index} job={jobMockData} />
         ))}
      </div>
   )
}
