import { JobFamily } from '@/types/job-category.type'
import { ChevronRightIcon } from 'lucide-react'

type CategoryItemProps = {
   category: JobFamily
   isActive?: boolean
   onHover?: (category: JobFamily | null) => void
}

export default function CategoryItem({ category, isActive, onHover }: CategoryItemProps) {
   return (
      <div
         className={`group flex w-full cursor-pointer items-center justify-between pr-2 text-black ${isActive ? 'text-primary' : ''}`}
         onMouseEnter={() => onHover?.(category)}
      >
         <span
            className={`text-sm font-medium ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}
         >
            {category.name}
         </span>
         <ChevronRightIcon
            size={16}
            className={isActive ? 'text-primary' : 'group-hover:text-primary'}
         />
      </div>
   )
}
