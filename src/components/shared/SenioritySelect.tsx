import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type Option = { label: string; value: string }

const OPTIONS: Option[] = [
   { label: 'Intern', value: 'INTERN' },
   { label: 'Fresher', value: 'FRESHER' },
   { label: 'Junior', value: 'JUNIOR' },
   { label: 'Mid', value: 'MID' },
   { label: 'Senior', value: 'SENIOR' },
   { label: 'Lead', value: 'LEAD' }
]

type Props<T extends FieldValues> = {
   control: Control<T>
   name: FieldPath<T>
}

export default function SenioritySelect<T extends FieldValues>({ control, name }: Props<T>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem>
               <FormLabel>Cấp bậc</FormLabel>
               <FormControl>
                  <select
                     className={cn(
                        'focus-visible:ring-primary/20 h-9 w-full rounded-md border bg-white px-3 text-sm outline-none focus-visible:ring-2'
                     )}
                     value={field.value}
                     onChange={field.onChange}
                  >
                     <option value=''>Chọn cấp bậc</option>
                     {OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                           {opt.label}
                        </option>
                     ))}
                  </select>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   )
}
