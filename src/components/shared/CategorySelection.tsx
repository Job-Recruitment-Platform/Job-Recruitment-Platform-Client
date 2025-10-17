import Button from '@/components/shared/Button'
import { ListIcon } from 'lucide-react'

export default function CategorySelection() {
   return (
      <Button variant='outline' className='rounded-full px-5 py-2.5'>
         <ListIcon size={16} />
         <span>Danh mục nghề</span>
      </Button>
   )
}
