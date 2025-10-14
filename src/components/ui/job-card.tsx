'use client'

import Image from 'next/image'
import React, { createContext, useContext } from 'react'

/** small cx helper (tránh cài clsx) */
const cx = (...a: (string | undefined | false)[]) => a.filter(Boolean).join(' ')

type Ctx = { asLink?: string; onApply?: () => void }
const JobCtx = createContext<Ctx | null>(null)
const useJob = () => {
   const v = useContext(JobCtx)
   if (!v) throw new Error('JobCard.* must be used inside <JobCard>')
   return v
}

type WithChildren = { children?: React.ReactNode; className?: string }

/* ---------------- Root ---------------- */
type JobCardProps = WithChildren & { asLink?: string; onApply?: () => void }
export function JobCard({ children, asLink, onApply, className }: JobCardProps) {
   return (
      <JobCtx.Provider value={{ asLink, onApply }}>
         <article
            className={cx(
               'border-primary/40 group relative flex min-h-[171px] w-full flex-col justify-between rounded-xl border bg-[#f2faf6] p-4',
               'hover:border-primary hover:bg-white',
               className
            )}
            role='region'
            aria-label='Job card'
         >
            {children}
         </article>
      </JobCtx.Provider>
   )
}

/* ---------------- Body ---------------- */
export const Body = ({ children, className }: WithChildren) => (
   <div className={cx('flex !h-full items-start gap-x-4', className)}>{children}</div>
)

export const Footer = ({ children, className }: WithChildren) => (
   <div className={cx('flex items-center justify-between', className)}>{children}</div>
)

export function Logo({
   src,
   alt = 'Company logo',
   className
}: { src?: string; alt?: string } & WithChildren) {
   return (
      <Image
         width={120}
         height={120}
         src={src || ''}
         alt={alt}
         loading='lazy'
         className='rounded-lg border object-cover p-2'
      />
   )
}

export const Content = ({ children, className }: WithChildren) => (
   <div className={cx('flex h-full flex-1 flex-col space-y-3', className)}>{children}</div>
)

// Block
export const TitleBlock = ({ children, className }: WithChildren) => (
   <h2 className={cx('flex items-stretch justify-between space-y-2 gap-x-1', className)}>
      {children}
   </h2>
)

export const TitleContent = ({ children, className }: WithChildren) => (
   <div className={cx('flex-1 space-y-3', className)}>{children}</div>
)

export const JobTitle = ({ children, className }: WithChildren) => (
   <div
      className={cx('group-hover:text-primary text-[15px] font-semibold text-black/80', className)}
   >
      {children}
   </div>
)

export const Company = ({ children, className }: WithChildren) => (
   <div className={cx('text-[13px] font-semibold text-gray-500/90 uppercase', className)}>
      {children}
   </div>
)

// Action
export const Actions = ({ children, className }: WithChildren) => (
   <div className={cx('flex items-center gap-2', className)}>{children}</div>
)

export const Salary = ({ children, className }: WithChildren) => (
   <div className={cx('text-primary text-right text-sm font-semibold', className)}>{children}</div>
)

export const Meta = ({ children, className }: WithChildren) => (
   <div className={cx('mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600', className)}>
      {children}
   </div>
)
/* ---------------- Buttons using context ---------------- */

export function QuickView({
   children = 'Xem nhanh',
   href,
   className,
   ...rest
}: React.ComponentProps<'a'>) {
   const { asLink } = useJob()
   return (
      <a
         href={href ?? asLink ?? '#'}
         {...rest}
         className={cx(
            'inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700',
            'hover:bg-emerald-100 focus:ring-2 focus:ring-emerald-400 focus:outline-none',
            className
         )}
      >
         {children}
         <svg
            viewBox='0 0 24 24'
            className='h-4 w-4'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.8'
         >
            <path d='M9 6l6 6-6 6' />
         </svg>
      </a>
   )
}

export function Apply({
   children = 'Ứng tuyển',
   className,
   onClick,
   ...rest
}: React.ComponentProps<'button'>) {
   const { onApply } = useJob()
   return (
      <button
         type='button'
         onClick={onClick ?? onApply}
         {...rest}
         className={cx(
            'inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white',
            'shadow-sm hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400 focus:outline-none',
            className
         )}
      >
         {children}
      </button>
   )
}

/* ---------------- Optional icons ---------------- */
export const Icon = {
   Location: () => (
      <svg
         viewBox='0 0 24 24'
         className='h-4 w-4 text-slate-500'
         fill='none'
         stroke='currentColor'
         strokeWidth='1.7'
      >
         <path d='M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z' />
         <circle cx='12' cy='10' r='2.5' />
      </svg>
   ),
   Clock: () => (
      <svg
         viewBox='0 0 24 24'
         className='h-4 w-4 text-slate-500'
         fill='none'
         stroke='currentColor'
         strokeWidth='1.7'
      >
         <circle cx='12' cy='12' r='9' />
         <path d='M12 7v5l3 2' />
      </svg>
   )
}
