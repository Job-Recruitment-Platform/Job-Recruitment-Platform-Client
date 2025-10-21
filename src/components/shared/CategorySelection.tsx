import Button from '@/components/shared/Button'
import { cn } from '@/lib/utils'
import { ListIcon } from 'lucide-react'

type CategorySelectionProps = {
   className?: string
}

export default function CategorySelection({ className }: CategorySelectionProps) {
   return (
      <Button variant='outline' className={cn('rounded-full px-5 py-2.5', className)}>
         <ListIcon size={16} />
         <span>Danh mục nghề</span>
      </Button>
   )
}
