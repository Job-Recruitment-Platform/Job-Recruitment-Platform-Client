import Button from '@/components/shared/Button'
import { cx } from 'class-variance-authority'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
   className?: string
   children?: React.ReactNode
   size?: 'sm' | 'md' | 'lg'
}

export default function Pagination({ className, children, size = 'sm' }: PaginationProps) {
   return (
      <div className={cx('flex items-center gap-x-3', className)}>
         <Button
            variant='outline'
            className={cx('rounded-full', {
               '!p-1.5': size === 'sm',
               '!p-2': size === 'md'
            })}
         >
            <ChevronLeft size={13} />
         </Button>
         {children}
         <Button
            variant='outline'
            className={cx('rounded-full', {
               '!p-1.5': size === 'sm',
               '!p-2': size === 'md'
            })}
         >
            <ChevronRight size={13} />
         </Button>
      </div>
   )
}
