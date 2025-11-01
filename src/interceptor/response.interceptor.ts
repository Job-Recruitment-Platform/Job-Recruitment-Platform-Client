import { handleBusinessErrorCode } from '@/constants/businessErrorCode.constant'
import { handleHttpErrorCode } from '@/constants/httpErrorCode.constant'
import { AxiosInstance, isAxiosError } from 'axios'
import { toast } from 'react-hot-toast'

export function setupResponseInterceptors(client: AxiosInstance): void {
   client.interceptors.response.use(
      (response) => {
         const { code, data } = response.data ?? {}

         if (typeof code === 'number' && code === 1000) {
            // unwrap API response data
            return data
         }

         // handle business error code
         if (typeof code === 'number') {
            handleBusinessErrorCode(code)
         }

         return response
      },

      // (HTTP 4xx, 5xx, network, timeout, etc.)
      (error) => {
         if (isAxiosError(error)) {
            if (error.response) {
               const { status } = error.response

               // handle HTTP error code
               handleHttpErrorCode(status)

               return Promise.reject(error)
            }

            if (error.request) {
               switch (error.code) {
                  case 'ECONNABORTED':
                     toast.error('Hết thời gian chờ phản hồi từ server.')
                     break
                  default:
                     if (typeof navigator !== 'undefined' && !navigator.onLine) {
                        toast.error('Kiểm tra kết nối mạng.')
                     } else {
                        toast.error('Không thể kết nối đến server.')
                     }
                     break
               }

               return Promise.reject(error)
            }
         }
      }
   )
}
