// Base API Response
export interface ApiResponse<T = unknown> {
   code: number
   message: string
   data: T
}

// Pagination Response
export interface PaginationMeta {
   currentPage: number
   pageSize: number
   totalPages: number
   totalItems: number
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
   meta: PaginationMeta
}
