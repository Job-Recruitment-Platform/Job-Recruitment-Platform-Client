import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Authentication - Dev Hiring Portal',
   description: 'Sign in or create an account to access the dev hiring portal'
}

export default function AuthLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
         <div className='w-full max-w-md px-4 py-8'>
            {/* Logo/Brand Section */}
            <div className='mb-8 text-center'>
               <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
                  Dev Hiring Portal
               </h1>
               <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                  Find your next developer role
               </p>
            </div>

            {/* Auth Form Container */}
            <div className='rounded-lg bg-white p-8 shadow-xl dark:bg-slate-800'>{children}</div>

            {/* Footer Text */}
            <p className='mt-6 text-center text-xs text-slate-500 dark:text-slate-400'>
               © {new Date().getFullYear()} Dev Hiring Portal. All rights reserved.
            </p>
         </div>
      </div>
   )
}
