import CategoryItem from '@/components/features/category/category-menu/CategoryItem'

type CategoryMenuProps = {
   className?: string
}

export default function CategoryMenu({ className }: CategoryMenuProps) {
   return (
      <div className={`flex w-full flex-col rounded-md pt-2.5 bg-white text-black ${className}`}>
         <div className='flex-1 pl-5'>
            <CategoryItem item='Công nghệ thông tin' />
            <CategoryItem item='Kinh doanh' />
            <CategoryItem item='Tiếp thị' />
            <CategoryItem item='Công nghệ thông tin' />
            <CategoryItem item='Kinh doanh' />
            <CategoryItem item='Tiếp thị' />
         </div>
         {/*  Pagination  */}
         <div className='h-[27px] w-full border'></div>
      </div>
   )
}
