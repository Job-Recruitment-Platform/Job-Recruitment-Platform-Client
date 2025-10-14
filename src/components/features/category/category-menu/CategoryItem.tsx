import { ChevronRightIcon } from 'lucide-react'

type CategoryItemProps = {
   item: string
}

export default function CategoryItem({ item }: CategoryItemProps) {
   return (
      <div className='group flex w-full text-white items-center justify-between py-2 pr-2'>
         <span className='group-hover:text-primary text-sm font-medium'>{item}</span>
         <ChevronRightIcon size={16} className='group-hover:text-primary' />
      </div>
   )
}
