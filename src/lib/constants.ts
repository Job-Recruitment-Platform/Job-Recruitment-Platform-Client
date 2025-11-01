export const errorCode: Map<number, string> = new Map([
   [400, 'Bad Request'],
   [401, 'Unauthorized'],
   [403, 'Forbidden'],
   [404, 'Not Found'],
   [500, 'Internal Server Error']
])

export const errorHttpCode: Map<number, string> = new Map([
   [400, 'Yêu cầu không hợp lệ.'],
   [403, 'Bạn không có quyền truy cập tài nguyên này.'],
   [404, 'Không tìm thấy tài nguyên được yêu cầu.'],
   [408, 'Yêu cầu hết thời gian chờ.'],
   [429, 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'],
   [500, 'Lỗi máy chủ nội bộ.'],
   [502, 'Bad Gateway — dịch vụ trung gian gặp sự cố.'],
   [503, 'Server đang bảo trì hoặc quá tải.'],
   [504, 'Gateway Timeout — máy chủ không phản hồi.']
])
