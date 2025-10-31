import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type Props<T extends FieldValues> = {
   control: Control<T>
   remoteName: FieldPath<T>
   relocateName: FieldPath<T>
}

export default function PreferencesFields<T extends FieldValues>({
   control,
   remoteName,
   relocateName
}: Props<T>) {
   return (
      <div className='grid gap-4 sm:grid-cols-2'>
         <FormField
            control={control}
            name={remoteName}
            render={({ field }) => (
               <FormItem className='flex flex-row items-center gap-2 space-y-0 rounded-md border p-3'>
                  <FormControl>
                     <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className='font-normal'>Ưu tiên làm việc từ xa</FormLabel>
               </FormItem>
            )}
         />
         <FormField
            control={control}
            name={relocateName}
            render={({ field }) => (
               <FormItem className='flex flex-row items-center gap-2 space-y-0 rounded-md border p-3'>
                  <FormControl>
                     <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className='font-normal'>Sẵn sàng chuyển nơi ở</FormLabel>
               </FormItem>
            )}
         />
      </div>
   )
}
