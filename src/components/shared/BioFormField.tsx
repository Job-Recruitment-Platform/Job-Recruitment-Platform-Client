import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type BioFormFieldProps<TFieldValues extends FieldValues> = {
   control: Control<TFieldValues>
   name: FieldPath<TFieldValues>
   label?: string
   placeholder?: string
   rows?: number
   className?: string
}

export default function BioFormField<TFieldValues extends FieldValues>({
   control,
   name,
   label = 'Giới thiệu bản thân',
   placeholder = 'Giới thiệu bản thân...',
   rows = 6,
   className
}: BioFormFieldProps<TFieldValues>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className={className}>
               <FormLabel className='font-medium text-gray-800/90'>{label}</FormLabel>
               <FormControl>
                  <Textarea rows={rows} placeholder={placeholder} {...field} value={field.value ?? ''} />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   )
}
