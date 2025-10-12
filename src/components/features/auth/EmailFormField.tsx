import FilledIcons from '@/components/shared/FilledIcons'
import { FormInput } from '@/components/shared/FormInput'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MailIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type EmailFormFieldProps<TFieldValues extends FieldValues> = {
   control: Control<TFieldValues>
   name: FieldPath<TFieldValues>
   label?: string
   placeholder?: string
}

export default function EmailFormField<TFieldValues extends FieldValues>({
   control,
   name,
   label = 'Email',
   placeholder = 'Email'
}: EmailFormFieldProps<TFieldValues>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem>
               <FormLabel className='font-normal text-gray-800/90'>{label}</FormLabel>
               <FormControl>
                  <FormInput
                     {...field}
                     placeholder={placeholder}
                     type='email'
                     leftIcon={<FilledIcons icon={MailIcon} fillColor='primary' size={20} />}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   )
}
