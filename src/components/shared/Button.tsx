import clsx from 'clsx'
import React from 'react'

const variantStyles = {
   primary: 'bg-primary text-white hover:brightness-105',
   secondary: 'bg-white border border-primary text-primary',
   ghost: 'bg-gray-200/60 hover:bg-gray-300/70',
   outline: 'bg-white border border-primary text-primary'
}

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
   variant?: 'primary' | 'ghost' | 'secondary' | 'outline'
}

export default function Button({
   children,
   className,
   variant = 'primary',
   disabled,
   ...props
}: ButtonProps) {
   return (
      <button
         className={clsx(
            `flex items-center justify-center gap-x-2 rounded px-3 py-1.5 text-[14px] font-medium hover:cursor-pointer`,
            `${className}`,
            `${variantStyles[variant]}`,
            `${disabled && '!cursor-not-allowed !border-gray-400 !text-gray-400'}`
         )}
         disabled={disabled}
         {...props}
      >
         {children}
      </button>
   )
}
