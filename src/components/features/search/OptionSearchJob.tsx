import Button from '@/components/shared/Button'
import CategorySelection from '@/components/shared/CategorySelection'

export default function OptionSearchJob() {
   return (
      <div className='flex w-full items-stretch gap-x-2'>
         <div className='rounded bg-white'>
            <CategorySelection className='border-0 !text-black' />
         </div>
         <Button variant='primary' className='rounded-full px-5 py-2'>
            Tìm kiếm
         </Button>
      </div>
   )
}
