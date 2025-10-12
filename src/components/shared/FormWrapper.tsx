import { Form } from '@/components/ui/form'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

type FormWrapperProps<TFieldValues extends FieldValues> = {
   form: UseFormReturn<TFieldValues>
   onSubmit: (data: TFieldValues) => void
   children: React.ReactNode
   className?: string
}

export default function FormWrapper<TFieldValues extends FieldValues>({
   form,
   onSubmit,
   children,
   className
}: FormWrapperProps<TFieldValues>) {
   return (
      <div className='w-full'>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className={`flex w-full flex-col gap-y-3 ${className || ''}`}
            >
               {children}
            </form>
         </Form>
      </div>
   )
}
