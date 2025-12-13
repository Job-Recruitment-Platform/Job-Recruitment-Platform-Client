'use client'

import { useEffect, useMemo, useState } from 'react'

type PaginationClientProps<T> = {
   items: T[]
   itemsPerPage: number
   initialPage?: number // optional: default to 1
}

type PaginationClientResult<T> = {
   pagedItems: T[]
   currentPage: number // 1-based
   totalPages: number

   isNext: boolean
   isPrev: boolean

   next: () => void
   prev: () => void
   goTo: (page: number) => void
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const usePaginationClient = <T>({
   items,
   itemsPerPage,
   initialPage = 1
}: PaginationClientProps<T>): PaginationClientResult<T> => {
   // Security/basic: itemsPerPage <= 0 => fallback to safe value to avoid division by zero / slice errors
   const safeItemsPerPage = Number.isFinite(itemsPerPage) && itemsPerPage > 0 ? itemsPerPage : 1

   // Performance: totalPages calculated with useMemo to avoid unnecessary recalculation
   const totalPages = useMemo(() => {
      const pages = Math.ceil(items.length / safeItemsPerPage)
      // UX: always >= 1 to prevent UI from showing "0 pages"
      return Math.max(1, pages)
   }, [items.length, safeItemsPerPage])

   const [currentPage, setCurrentPage] = useState<number>(() => clamp(initialPage, 1, totalPages))

   // Performance + correctness: if items change and totalPages decreases,
   // clamp currentPage to prevent exceeding totalPages
   useEffect(() => {
      setCurrentPage((prev) => clamp(prev, 1, totalPages))
   }, [totalPages])

   // Performance: slice based on currentPage & itemsPerPage
   const pagedItems = useMemo(() => {
      const start = (currentPage - 1) * safeItemsPerPage
      const end = start + safeItemsPerPage
      return items.slice(start, end)
   }, [items, currentPage, safeItemsPerPage])

   const isPrev = currentPage > 1
   const isNext = currentPage < totalPages

   const goTo = (page: number) => {
      // Basic validation: clamp page to avoid meaningless setState / out-of-range values
      setCurrentPage(clamp(page, 1, totalPages))
   }

   const next = () => {
      // Performance: functional setState avoids stale closure
      setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
   }

   const prev = () => {
      setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
   }

   return {
      pagedItems,
      currentPage,
      totalPages,
      isNext,
      isPrev,
      next,
      prev,
      goTo
   }
}
