import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Trash } from 'lucide-react'
import type { FieldArrayPath, FieldPath, FieldValues } from 'react-hook-form'
import { useFieldArray, useFormContext } from 'react-hook-form'

type Props<T extends FieldValues> = {
   name: FieldArrayPath<T> // e.g., 'skills'
}

export default function SkillsFieldArray<T extends FieldValues>({ name }: Props<T>) {
   const { control } = useFormContext<T>()
   const { fields, append, remove } = useFieldArray<T>({ control, name })

   return (
      <div className='space-y-3'>
         <div className='flex items-center justify-between'>
            <FormLabel>Kỹ năng</FormLabel>
            <Button
               type='button'
               size='sm'
               onClick={() => append({ skillName: '', level: 1 } as never)}
            >
               Thêm kỹ năng
            </Button>
         </div>
         <div className='space-y-2'>
            {fields.map((field, index) => (
               <div key={field.id} className='grid gap-3 sm:grid-cols-[1fr_140px_40px]'>
                  <FormField
                     control={control}
                     name={`${name}.${index}.skillName` as unknown as FieldPath<T>}
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input placeholder='Tên kỹ năng (VD: React)' {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={control}
                     name={`${name}.${index}.level` as unknown as FieldPath<T>}
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 placeholder='Mức (1-5)'
                                 type='number'
                                 min={1}
                                 max={5}
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type='button' variant='ghost' size='icon' onClick={() => remove(index)}>
                     <Trash size={16} />
                  </Button>
               </div>
            ))}
         </div>
      </div>
   )
}
