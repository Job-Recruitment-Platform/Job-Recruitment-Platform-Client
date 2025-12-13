import CategoryMenu from '@/components/features/category/category-menu/CategoryMenu'
import SearchBar from '@/components/features/home/searchbar/SearchBar'

export default function HomeHero() {
   return (
      <div
         className='flex w-full justify-center space-y-3 py-5'
         style={{
            background:
               'linear-gradient(180deg, #002b33, rgba(0, 43, 51, 0.25)), linear-gradient(90deg, #008060 21.86%, #2bab60 78.13%)'
         }}
      >
         {/*  Container  */}
         <div className='container px-3.5'>
            <div className='text-primary w-full text-center text-[26px] font-bold'>
               Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
            </div>
            <div className='mt-1 w-full text-center text-sm text-white'>
               Tiếp cận 60.000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín
               tại Việt Nam
            </div>

            {/*  Search bar  */}
            <SearchBar />

            {/*  Category & Category list  */}
            <div className='flex !h-[288px] !items-stretch gap-x-2'>
               <div className='flex-1/3'>
                  <CategoryMenu />
               </div>
               <div className='flex-2/3'>
                  <img
                     src='https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/banners/70JMzq6wtsE9olC5DGHSoViPXeqFt1PB_1765247587____2cabb4d369fceb34a213e7049f115877.jpg'
                     alt=''
                     className='h-[288px] w-full rounded-md object-cover'
                  />
               </div>
            </div>
         </div>
      </div>
   )
}
