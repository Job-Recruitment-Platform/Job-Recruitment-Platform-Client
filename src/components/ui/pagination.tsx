import Button from '@/components/shared/Button'
import { cx } from 'class-variance-authority'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
   className?: string
   children?: React.ReactNode
}

export default function Pagination({ className, children }: PaginationProps) {
   return (
      <div className={cx('flex items-center gap-x-3', className)}>
         <Button variant='outline' className='rounded-full !p-2'>
            <ChevronLeft size={13} />
         </Button>
         {children}
         <Button variant='outline' className='rounded-full !p-2'>
            <ChevronRight size={13} />
         </Button>
      </div>
   )
}
