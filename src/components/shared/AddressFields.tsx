import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// no explicit RHF generics needed; FormField from shadcn handles typing via context
import { useFormContext } from 'react-hook-form'

type AddressFieldsProps = {
   prefix?: string // defaults to 'location'
}

export default function AddressFields({ prefix = 'location' }: AddressFieldsProps) {
   const { control } = useFormContext()
   const streetName = `${prefix}.streetAddress`
   const wardName = `${prefix}.ward`
   const cityName = `${prefix}.provinceCity`

   return (
      <div className='grid gap-4 sm:grid-cols-3'>
         <FormField
            control={control}
            name={streetName}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                     <Input placeholder='Số nhà, đường...' {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
         <FormField
            control={control}
            name={wardName}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Phường/Xã</FormLabel>
                  <FormControl>
                     <Input placeholder='Phường/Xã' {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
         <FormField
            control={control}
            name={cityName}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <FormControl>
                     <Input placeholder='TP. Hồ Chí Minh' {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </div>
   )
}
