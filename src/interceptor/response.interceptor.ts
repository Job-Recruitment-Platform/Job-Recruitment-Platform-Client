import { handleBusinessErrorCode } from '@/constants/businessErrorCode.constant'
import { AxiosInstance, isAxiosError } from 'axios'
import { toast } from 'react-hot-toast'

export function setupResponseInterceptors(client: AxiosInstance): void {
   client.interceptors.response.use(
      (response) => response,

      // (HTTP 4xx, 5xx, network, timeout, etc.)
      (error) => {
         console.log('❌ Response Error:', error)
         if (isAxiosError(error)) {
            if (error.response) {
               console.log('❌ Error Response:', error.response.data)
               handleBusinessErrorCode(error.response.data?.code)

               return Promise.reject(error)
            }

            if (error.request) { 
               switch (error.code) {
                  case 'ECONNABORTED':
                     toast.error('Hết thời gian chờ phản hồi từ server.', { id: 'timeout-error' })
                     break
                  default:
                     if (typeof navigator !== 'undefined' && !navigator.onLine) {
                        toast.error('Kiểm tra kết nối mạng.', { id: 'network-error' })
                     } else {
                        toast.error('Không thể kết nối đến server.', { id: 'network-error' })
                     }
                     break
               }

               return Promise.reject(error)
            }
         }
      }
   )
}
