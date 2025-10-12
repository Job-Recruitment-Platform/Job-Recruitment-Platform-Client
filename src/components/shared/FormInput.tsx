import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { forwardRef } from 'react'

type FormInputProps = {
   label?: string
   placeholder?: string
   type?: string
   leftIcon?: React.ReactNode
   rightIcons?: React.ReactNode
   value?: string
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
   onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
   name?: string
   className?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
   (
      {
         label,
         placeholder,
         type = 'text',
         leftIcon,
         rightIcons,
         value,
         onChange,
         onBlur,
         className,
         name
      },
      ref
   ) => {
      return (
         <InputGroup className={`!border-gray-250 !h-auto rounded-none py-0.5 pr-2 ${className}`}>
            <Label>{label}</Label>
            <InputGroupInput
               ref={ref}
               className='!px-5'
               type={type}
               placeholder={placeholder}
               value={value}
               onChange={onChange}
               onBlur={onBlur}
               name={name}
            />
            {leftIcon && <InputGroupAddon>{leftIcon}</InputGroupAddon>}
            {rightIcons && <InputGroupAddon align='inline-end'>{rightIcons}</InputGroupAddon>}
         </InputGroup>
      )
   }
)

FormInput.displayName = 'FormInput'
