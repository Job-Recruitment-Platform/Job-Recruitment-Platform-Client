// Base API Response
export interface ApiResponse<T = unknown> {
   code: number
   message: string
   data: T
}

// Pagination Response
export interface PaginationResponse<T> {
   page: number
   size: number
   totalElements: number
   totalPages: number
   first: boolean
   last: boolean
   hasNext: boolean
   hasPrevious: boolean
   content: T
}
  