import HomeHero from '@/components/features/home/HomeHero'
import FeatureJobList from '@/components/features/job/FeatureJobList'
import Pagination from '@/components/ui/pagination'

export default function Home() {
   return (
      <div className='w-full bg-[#f3f5f7]'>
         <HomeHero />
         <div className='container'>
            <h2 className='text-primary py-3'>Việc làm tốt nhất</h2>
            <FeatureJobList />
            <div className='my-5 flex w-full justify-center'>
               <Pagination>
                  <div className='text-sm font-semibold text-gray-400'>1/10 trang</div>
               </Pagination>
            </div>
         </div>
      </div>
   )
}
