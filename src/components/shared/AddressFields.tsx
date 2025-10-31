import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// no explicit RHF generics needed; FormField from shadcn handles typing via context

type AddressFieldsProps = {
   prefix?: string // defaults to 'location'
}

export default function AddressFields({ prefix = 'location' }: AddressFieldsProps) {
   const streetName = `${prefix}.streetAddress`
   const wardName = `${prefix}.ward`
   const cityName = `${prefix}.provinceCity`

   return (
      <div className='grid gap-4 sm:grid-cols-3'>
         <FormField
            name={streetName}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                     <Input placeholder='Số nhà, đường...' {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
         <FormField
            name={wardName}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Phường/Xã</FormLabel>
                  <FormControl>
                     <Input placeholder='Phường/Xã' {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
         <FormField
            name={cityName}
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <FormControl>
                     <Input placeholder='TP. Hồ Chí Minh' {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </div>
   )
}
