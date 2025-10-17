import CategoryMenu from '@/components/features/category/category-menu/CategoryMenu'
import SearchBar from '@/components/features/home/searchbar/SearchBar'

export default function HomeHero() {
   return (
      <div
         className='flex w-full justify-center space-y-3 py-3'
         style={{
            background:
               'linear-gradient(180deg, #002b33, rgba(0, 43, 51, 0.25)), linear-gradient(90deg, #008060 21.86%, #2bab60 78.13%)'
         }}
      >
         {/*  container  */}
         <div className='container px-3.5'>
            <div className='text-primary w-full text-center text-[26px] font-bold'>
               Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
            </div>
            <div className='w-full mt-1 text-center text-sm text-white'>
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
