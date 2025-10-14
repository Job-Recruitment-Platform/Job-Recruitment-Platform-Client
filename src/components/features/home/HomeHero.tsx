import CategoryMenu from '@/components/features/category/category-menu/CategoryMenu'
import SearchBar from '@/components/features/home/searchbar/SearchBar'

export default function HomeHero() {
   return (
      <div className='flex w-full justify-center space-y-3 bg-green-700 py-3'>
         {/*  container  */}
         <div className='w-[1170px] px-3.5'>
            <div className='w-full text-center'>
               Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
            </div>
            <div className='w-full text-center'>
               Tiếp cận 60.000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín
               tại Việt Nam
            </div>
            {/*  search bar  */}
            <SearchBar />
            {/*  category & category list  */}
            <div className='flex h-[288px] items-stretch gap-x-2'>
               <div className='flex-1/3'>
                  <CategoryMenu />
               </div>
               <div className='flex-2/3'></div>
            </div>
         </div>
      </div>
   )
}
