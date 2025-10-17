import Button from '@/components/shared/Button'
import { MapPinIcon } from 'lucide-react'

export default function MultiLocationSelection() {
   return (
      <div className='border-r pr-2'>
         <Button
            variant='outline'
            className='justify-start rounded-full border-0 bg-gray-200 px-10 py-2.5'
         >
            <MapPinIcon size={16} />
            <span>Địa điểm</span>
         </Button>
      </div>
   )
}
