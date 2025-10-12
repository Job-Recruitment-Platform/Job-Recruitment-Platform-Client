import FilledIcons from '@/components/shared/FilledIcons'
import { FormInput } from '@/components/shared/FormInput'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PhoneIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type PhoneFormFieldProps<TFieldValues extends FieldValues> = {
   control: Control<TFieldValues>
   name: FieldPath<TFieldValues>
   label?: string
   placeholder?: string
}

export default function PhoneFormField<TFieldValues extends FieldValues>({
   control,
   name,
   label = 'Số điện thoại',
   placeholder = 'Số điện thoại cá nhân'
}: PhoneFormFieldProps<TFieldValues>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem>
               <FormLabel className='font-medium text-gray-800/90'>{label}</FormLabel>
               <FormControl>
                  <FormInput
                     {...field}
                     placeholder={placeholder}
                     type='text'
                     leftIcon={<FilledIcons icon={PhoneIcon} fillColor='primary' size={20} />}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   )
}
