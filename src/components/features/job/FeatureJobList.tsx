import FeatureJobItem from '@/components/features/job/FeatureJobItem'
import { jobMockData } from '@/types/data'

export default function FeatureJobList() {
   return (
      <div className='container grid grid-cols-3 gap-4'>
         {jobMockData.map((job, index) => (
            <FeatureJobItem key={index} job={job} />
         ))}
      </div>
   )
}
