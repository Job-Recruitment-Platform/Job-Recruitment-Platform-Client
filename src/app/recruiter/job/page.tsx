'use client'
import { Briefcase, Eye, EyeOff, Pencil, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import Button from '@/components/shared/Button'
import Pagination from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'

export default function RecruiterJobsPage() {
   const allJobs = [
      { id: '1', title: 'Frontend Engineer', createdAt: '2025-10-10', status: 'active', views: 342, applicants: 18 },
      { id: '2', title: 'Backend Engineer', createdAt: '2025-10-05', status: 'hidden', views: 201, applicants: 9 },
      { id: '3', title: 'QA Engineer', createdAt: '2025-10-01', status: 'active', views: 128, applicants: 12 },
      { id: '4', title: 'DevOps Engineer', createdAt: '2025-09-28', status: 'active', views: 410, applicants: 21 },
      { id: '5', title: 'Product Manager', createdAt: '2025-09-25', status: 'hidden', views: 97, applicants: 6 },
      { id: '6', title: 'UI/UX Designer', createdAt: '2025-09-22', status: 'active', views: 250, applicants: 14 },
      { id: '7', title: 'Data Engineer', createdAt: '2025-09-18', status: 'active', views: 310, applicants: 17 },
      { id: '8', title: 'Mobile Developer', createdAt: '2025-09-15', status: 'hidden', views: 120, applicants: 8 }
   ]

   const [page, setPage] = useState(1)
   const [search, setSearch] = useState('')
   const [status, setStatus] = useState<'all' | 'active' | 'hidden'>('all')
   const pageSize = 5

   const filtered = useMemo(() => {
      return allJobs.filter((j) => {
         const matchStatus = status === 'all' ? true : j.status === status
         const matchSearch = j.title.toLowerCase().includes(search.toLowerCase().trim())
         return matchStatus && matchSearch
      })
   }, [allJobs, search, status])

   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
   const jobs = useMemo(() => {
      const start = (page - 1) * pageSize
      return filtered.slice(start, start + pageSize)
   }, [filtered, page])

   return (
      <div className='space-y-6'>
         <div className='space-y-3'>
            <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
               <div>
                  <div className='text-xl font-semibold'>Quản lý tin tuyển dụng</div>
                  <div className='text-sm text-gray-500'>Xem và quản lý các tin tuyển dụng của bạn</div>
               </div>
               <Link
                  href='/job/save'
                  className='inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90'
               >
                  <PlusCircle size={16} />
                  Tạo tin mới
               </Link>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
               <div className='flex items-center gap-2'>
                  {([
                     { key: 'all', label: 'Tất cả' },
                     { key: 'active', label: 'Đang hiển thị' },
                     { key: 'hidden', label: 'Tạm ẩn' }
                  ] as const).map((tab) => {
                     const isActive = status === tab.key
                     const count = allJobs.filter((j) => (tab.key === 'all' ? true : j.status === tab.key)).length
                     return (
                        <button
                           key={tab.key}
                           onClick={() => {
                              setStatus(tab.key)
                              setPage(1)
                           }}
                           className={`rounded-full border px-3 py-1 text-xs ${
                              isActive ? 'border-primary text-primary' : 'text-gray-600 hover:bg-gray-50'
                           }`}
                        >
                           {tab.label}
                           <span className={`ml-2 rounded-full px-1.5 py-0.5 ${
                              isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                           }`}>
                              {count}
                           </span>
                        </button>
                     )
                  })}
               </div>
               <div className='w-full sm:w-64'>
                  <Input
                     placeholder='Tìm theo chức danh...'
                     value={search}
                     onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                     }}
                     aria-label='Tìm kiếm tin tuyển dụng'
                  />
               </div>
            </div>
         </div>

         <div className='overflow-hidden rounded-md border bg-white'>
            <div className='grid grid-cols-12 gap-2 border-b px-4 py-3 text-xs font-medium text-gray-500'>
               <div className='col-span-5'>Chức danh</div>
               <div className='col-span-2 hidden sm:block'>Ngày tạo</div>
               <div className='col-span-2 text-center'>Lượt xem</div>
               <div className='col-span-1 text-center'>Ứng viên</div>
               <div className='col-span-2 text-right'>Thao tác</div>
            </div>

            <div className='divide-y'>
               {jobs.map((job) => (
                  <div key={job.id} className='grid grid-cols-12 items-center gap-2 px-4 py-4 text-sm'>
                     <div className='col-span-5 min-w-0'>
                        <div className='truncate font-medium'>{job.title}</div>
                        <div className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs ${
                           job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                           {job.status === 'active' ? 'Đang hiển thị' : 'Tạm ẩn'}
                        </div>
                     </div>
                     <div className='col-span-2 hidden text-gray-500 sm:block'>{job.createdAt}</div>
                     <div className='col-span-2 text-center'>{job.views}</div>
                     <div className='col-span-1 text-center'>{job.applicants}</div>
                     <div className='col-span-2 flex items-center justify-end gap-2'>
                        <Link href={`/job/${job.id}/detail`} className='rounded-md border px-2 py-1 hover:bg-gray-50'>
                           <Briefcase size={16} />
                        </Link>
                        <button className='rounded-md border px-2 py-1 hover:bg-gray-50'>
                           <Pencil size={16} />
                        </button>
                        <button className='rounded-md border px-2 py-1 hover:bg-gray-50'>
                           {job.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className='flex items-center justify-between'>
            <div className='text-xs text-gray-500'>
               Hiển thị {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} trong số {filtered.length}
            </div>
            <Pagination
               onPrev={() => setPage((p) => Math.max(1, p - 1))}
               onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
               disabledPrev={page === 1}
               disabledNext={page === totalPages}
            >
               {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1
                  const isActive = pageNum === page
                  return (
                     <Button
                        key={pageNum}
                        variant={isActive ? 'primary' : 'outline'}
                        className='rounded-full px-3 py-1 text-xs'
                        onClick={() => setPage(pageNum)}
                     >
                        {pageNum}
                     </Button>
                  )
               })}
            </Pagination>
         </div>
      </div>
   )
}


