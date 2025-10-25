import FilledIcons from '@/components/shared/FilledIcons'
import { FormInput } from '@/components/shared/FormInput'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MapPinIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type LocationFormFieldProps<TFieldValues extends FieldValues> = {
   control: Control<TFieldValues>
   name: FieldPath<TFieldValues>
   label?: string
   placeholder?: string
}

export default function LocationFormField<TFieldValues extends FieldValues>({
   control,
   name,
   label = 'Địa điểm làm việc',
   placeholder = 'Chọn tỉnh/thành phố'
}: LocationFormFieldProps<TFieldValues>) {
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
                     leftIcon={<FilledIcons icon={MapPinIcon} size={18} />}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   )
}
