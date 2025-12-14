import toast, { type Toast } from 'react-hot-toast'

// Toast configuration
const defaultConfig = {
   duration: 4000,
   position: 'top-center' as const,
   style: {
      fontWeight: '500'
   }
}

// Success toast
export const showSuccessToast = (message: string, config?: Partial<Toast>) => {
   return toast.success(message, {
      ...defaultConfig,
      ...config
   })
}

// Error toast
export const showErrorToast = (message: string, config?: Partial<Toast>) => {
   return toast.error(message, {
      ...defaultConfig,
      duration: 5000,
      ...config
   })
}

// Info toast
export const showInfoToast = (message: string, config?: Partial<Toast>) => {
   return toast(message, {
      ...defaultConfig,
      ...config,
      style: {
         ...defaultConfig.style,
         background: '#3b82f6',
         color: '#fff',
         ...config?.style
      },
      icon: 'ℹ️'
   })
}

// Warning toast
export const showWarningToast = (message: string, config?: Partial<Toast>) => {
   return toast(message, {
      ...defaultConfig,
      ...config,
      style: {
         ...defaultConfig.style,
         background: '#f59e0b',
         color: '#fff',
         ...config?.style
      },
      icon: '⚠️'
   })
}

// Loading toast
export const showLoadingToast = (message: string) => {
   return toast.loading(message, {
      position: 'top-center',
      style: {
         background: '#6b7280',
         color: '#fff',
         fontWeight: '500'
      }
   })
}

// Promise toast (auto show loading, success, error)
export const showPromiseToast = <T>(
   promise: Promise<T>,
   messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
   }
) => {
   return toast.promise(
      promise,
      {
         loading: messages.loading,
         success: messages.success,
         error: messages.error
      },
      {
         position: 'top-center',
         style: {
            fontWeight: '500'
         },
         success: {
            style: {
               background: '#10b981',
               color: '#fff'
            },
            icon: '✅'
         },
         error: {
            style: {
               background: '#ef4444',
               color: '#fff'
            },
            icon: '❌'
         }
      }
   )
}

// Custom toast
export const showCustomToast = (message: string, config?: Partial<Toast>) => {
   return toast(message, {
      ...defaultConfig,
      ...config
   })
}

// Dismiss toast
export const dismissToast = (toastId?: string) => {
   if (toastId) {
      toast.dismiss(toastId)
   } else {
      toast.dismiss()
   }
}

// Dismiss all toasts
export const dismissAllToasts = () => {
   toast.dismiss()
}
