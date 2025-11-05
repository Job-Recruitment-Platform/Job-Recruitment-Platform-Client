import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

type Props<T extends FieldValues> = {
   control: Control<T>
   minName?: FieldPath<T>
   maxName?: FieldPath<T>
   currencyName?: FieldPath<T>
}

export default function SalaryRangeFields<T extends FieldValues>({
   control,
   minName,
   maxName,
   currencyName
}: Props<T>) {
   const minField = minName ?? ('salaryExpectMin' as FieldPath<T>)
   const maxField = maxName ?? ('salaryExpectMax' as FieldPath<T>)
   const currencyField = currencyName ?? ('currency' as FieldPath<T>)
   return (
      <div className='grid gap-4 sm:grid-cols-3'>
         <FormField
            control={control}
            name={minField}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Lương mong muốn (min)</FormLabel>
                  <FormControl>
                     <Input
                        type='number'
                        placeholder='100'
                        value={field.value ?? ''}
                        onChange={(e) => {
                           const v = e.target.value
                           field.onChange(v === '' ? undefined : Number(v))
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
         <FormField
            control={control}
            name={maxField}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Lương mong muốn (max)</FormLabel>
                  <FormControl>
                     <Input
                        type='number'
                        placeholder='9000'
                        value={field.value ?? ''}
                        onChange={(e) => {
                           const v = e.target.value
                           field.onChange(v === '' ? undefined : Number(v))
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
         <FormField
            control={control}
            name={currencyField}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Tiền tệ</FormLabel>
                  <FormControl>
                     <Input placeholder='VND' {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </div>
   )
}
