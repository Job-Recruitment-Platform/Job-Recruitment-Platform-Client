import CategoryItem from '@/components/features/category/category-menu/CategoryItem'
import Pagination from '@/components/ui/pagination'

type CategoryMenuProps = {
   className?: string
}

export default function CategoryMenu({ className }: CategoryMenuProps) {
   return (
      <div
         className={`flex h-full w-full flex-col rounded-md bg-white pt-2.5 text-black ${className}`}
      >
         <div className='flex flex-1 flex-col justify-evenly pl-5'>
            <CategoryItem item='Công nghệ thông tin' />
            <CategoryItem item='Kinh doanh' />
            <CategoryItem item='Tiếp thị' />
            <CategoryItem item='Công nghệ thông tin' />
            <CategoryItem item='Kinh doanh' />
            <CategoryItem item='Tiếp thị' />
         </div>
         {/*  Pagination  */}
         <div className='flex h-[40px] w-full items-center justify-between border-t pr-3 pl-5'>
            <div className='text-sm font-semibold text-gray-400'>1/5</div>
            <Pagination className='!gap-x-2' />
         </div>
      </div>
   )
}
