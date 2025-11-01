import { toast } from 'react-hot-toast'

export const HTTP_ERROR_CODE: Record<number, string> = {
   400: 'Yêu cầu không hợp lệ.',
   403: 'Bạn không có quyền truy cập tài nguyên này.',
   404: 'Không tìm thấy tài nguyên được yêu cầu.',
   408: 'Yêu cầu hết thời gian chờ.',
   429: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
   500: 'Lỗi máy chủ nội bộ.'
} as const

export const getHttpErrorMessage = (code: unknown): string => {
   const n = typeof code === 'string' ? Number(code) : (code as number)
   return HTTP_ERROR_CODE[n] ?? 'Có lỗi xảy ra, vui lòng thử lại sau.'
}

export const handleHttpErrorCode = (code: unknown): void => {
   toast.error(getHttpErrorMessage(code))
}
