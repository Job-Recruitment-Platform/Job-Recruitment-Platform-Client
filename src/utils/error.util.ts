import { errorCode, errorHttpCode } from '@/lib/constants'
import toast from 'react-hot-toast'

export const handleBusinessErrorCode = (code: number): void => {
   if (errorCode.has(code)) {
      toast.error(errorCode.get(code) ?? 'Lỗi không xác định!')
   } else {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!')
   }
}

export const handleHttpErrorCode = (status: number): void => {
   if (errorHttpCode.has(status)) {
      toast.error(errorHttpCode.get(status) ?? 'Lỗi không xác định!')
   } else {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!')
   }
}
