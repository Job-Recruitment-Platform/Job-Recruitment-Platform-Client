import FilledIcons from '@/components/shared/FilledIcons'
import { FormInput } from '@/components/shared/FormInput'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { UserIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type FullNameFormFieldProps<TFieldValues extends FieldValues> = {
   control: Control<TFieldValues>
   name: FieldPath<TFieldValues>
   label?: string
   placeholder?: string
   className?: string
}

export default function FullNameFormField<TFieldValues extends FieldValues>({
   control,
   name,
   label = 'Họ và tên',
   placeholder = 'Nhập họ và tên',
   className
}: FullNameFormFieldProps<TFieldValues>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className={className}>
               <FormLabel className='font-medium text-gray-800/90'>{label}</FormLabel>
               <FormControl>
                  <FormInput
                     {...field}
                     value={field.value ?? ''}
                     placeholder={placeholder}
                     type='text'
                     leftIcon={<FilledIcons icon={UserIcon} fillColor='primary' size={20} />}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   )
}
