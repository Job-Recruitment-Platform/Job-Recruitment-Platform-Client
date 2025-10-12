import FilledIcons from '@/components/shared/FilledIcons'
import { FormInput } from '@/components/shared/FormInput'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility'
import { EyeIcon, EyeOffIcon, ShieldIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type PasswordFormFieldProps<TFieldValues extends FieldValues> = {
   control: Control<TFieldValues>
   name: FieldPath<TFieldValues>
   label?: string
   placeholder?: string
}

export default function PasswordFormField<TFieldValues extends FieldValues>({
   control,
   name,
   label = 'Mật khẩu',
   placeholder = 'Mật khẩu'
}: PasswordFormFieldProps<TFieldValues>) {
   const { show, toggle } = usePasswordVisibility()

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
                     type={show ? 'text' : 'password'}
                     leftIcon={<FilledIcons icon={ShieldIcon} fillColor='primary' size={20} />}
                     rightIcons={
                        <button type='button' onClick={toggle}>
                           {show ? (
                              <EyeIcon size={20} color='#bcc1c5' />
                           ) : (
                              <EyeOffIcon size={20} color='#bcc1c5' />
                           )}
                        </button>
                     }
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   )
}
