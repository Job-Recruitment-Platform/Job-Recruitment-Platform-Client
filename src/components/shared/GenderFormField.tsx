import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type GenderFormFieldProps<TFieldValues extends FieldValues> = {
   control: Control<TFieldValues>
   name: FieldPath<TFieldValues>
   label?: string
}

export default function GenderFormField<TFieldValues extends FieldValues>({
   control,
   name,
   label = 'Giới tính'
}: GenderFormFieldProps<TFieldValues>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem>
               <FormLabel className='font-medium text-gray-800/90'>{label}</FormLabel>
               <FormControl>
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                     <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='male' id='male' />
                        <label htmlFor='male' className='cursor-pointer'>
                           Nam
                        </label>
                     </div>
                     <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='female' id='female' />
                        <label htmlFor='female' className='cursor-pointer'>
                           Nữ
                        </label>
                     </div>
                  </RadioGroup>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   )
}
