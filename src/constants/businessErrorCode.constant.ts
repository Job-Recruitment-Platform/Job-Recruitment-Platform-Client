// errorMessages.ts
import { toast } from 'react-hot-toast'

export const BUSINESS_ERROR_MESSAGES: Record<number, string> = {
   // ===== Credentials (1001 - 1100)
   1001: 'Email này đã được đăng ký.',
   1002: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
   1003: 'Mật khẩu mới trùng với mật khẩu cũ.',
   1004: 'Họ và tên không được để trống.',
   1005: 'Email không được để trống.',
   1006: 'Mật khẩu phải có ít nhất 8 ký tự.',
   1007: 'Địa chỉ email không hợp lệ.',
   1008: 'Tên công ty không được để trống.',
   1011: 'Level phải nằm trong khoảng 0–5.',
   1012: 'Tài khoản này không được phép thực hiện thao tác này.',
   // ===== Auth (1101 - 1200)
   1101: 'Bạn chưa đăng nhập.',
   1102: 'Bạn không có quyền truy cập.',
   1103: 'Tài khoản của bạn đã bị khóa.',
   1104: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',

   // ===== Account (1301 - 1400)
   1301: 'Không tìm thấy tài khoản.',
   1302: 'Tài khoản đã được liên kết với Google.',
   1303: 'Tài khoản Google không khớp.',
   1304: 'Tài khoản Google này đã được sử dụng.',
   1305: 'Không tìm thấy hồ sơ ứng viên tương ứng.',
   1306: 'Mã xác minh email không hợp lệ.',
   1307: 'Tài khoản đã được xác minh.',
   1308: 'Không tìm thấy recruiter cho tài khoản này.',
   1401: 'Không tìm thấy dữ liệu vai trò/công ty phù hợp.',
   1403: 'Bạn không được phép truy cập.',

   // ===== Job (1501 - 1600)
   1501: 'Không tìm thấy tin tuyển dụng.',
   1502: 'Không tìm thấy vai trò tuyển dụng.',
   1503: 'Tin tuyển dụng đã đóng, không thể cập nhật.',
   1504: 'Tin tuyển dụng đã có ứng viên, không thể cập nhật.',
   1505: 'Tin tuyển dụng đã hết hạn, không thể ứng tuyển.',
   1506: 'Tin tuyển dụng không ở trạng thái chờ duyệt.',
   1507: 'Không tìm thấy đơn ứng tuyển.',
   1508: 'Bạn không có quyền xem danh sách ứng viên của tin này.',
   1509: 'Tin tuyển dụng đã được xử lý.',
   1510: 'Tin tuyển dụng này đã được lưu trong tài khoản của bạn.',

   // ===== Location / Skill
   1601: 'Không tìm thấy địa điểm.',
   1701: 'Không tìm thấy kỹ năng.'
} as const

export const getBusinessErrorMessage = (code: unknown): string => {
   const n = typeof code === 'string' ? Number(code) : (code as number)
   return BUSINESS_ERROR_MESSAGES[n] ?? 'Có lỗi xảy ra, vui lòng thử lại sau.'
}

export const handleBusinessErrorCode = (code: unknown): void => {
   toast.error(getBusinessErrorMessage(code))
}
