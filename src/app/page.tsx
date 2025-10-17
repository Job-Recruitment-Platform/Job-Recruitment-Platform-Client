import HomeHero from '@/components/features/home/HomeHero'
import FeatureJobList from '@/components/features/job/FeatureJobList'
import Pagination from '@/components/ui/pagination'

export default function Home() {
   return (
      <div className='w-full'>
         <HomeHero />
         <div className='container'>
            <h2 className='text-primary py-3'>Việc làm tốt nhất</h2>
            <FeatureJobList />
            <div className='flex w-full my-5 justify-center'>
               <Pagination>
                  <div className='font-semibold text-sm text-gray-400'>8/32 trang</div>
               </Pagination>
            </div>
         </div>
      </div>
   )
}
