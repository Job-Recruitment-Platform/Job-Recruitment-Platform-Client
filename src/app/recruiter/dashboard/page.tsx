import { Briefcase, FileText, Users } from 'lucide-react'
import Link from 'next/link'

export default function RecruiterDashboardPage() {
   return (
      <div className='space-y-6'>
         <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
            <div>
               <div className='text-xl font-semibold'>Tổng quan nhà tuyển dụng</div>
               <div className='text-sm text-gray-500'>Theo dõi hiệu quả tuyển dụng và quản lý tin đăng</div>
            </div>
            <Link
               href='/job/save'
               className='inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90'
            >
               <Briefcase size={16} />
               Đăng tin tuyển dụng
            </Link>
         </div>

         <div className='rounded-md border bg-white p-4'>
            <div className='mb-4 flex items-center justify-between'>
               <div className='text-sm font-semibold'>Ứng tuyển theo tuần</div>
               <div className='text-xs text-gray-500'>8 tuần gần nhất</div>
            </div>
            <ApplicationsChart />
         </div>

         <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <StatCard icon={Briefcase} label='Tin đang đăng' value='4' delta='+1 tuần này' />
            <StatCard icon={Users} label='Ứng viên mới' value='23' delta='+5 tuần này' />
            <StatCard icon={FileText} label='Hồ sơ chờ duyệt' value='8' delta='-2 tuần này' />
         </div>

         <div className='grid gap-4 lg:grid-cols-2'>
            <div className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Tin tuyển dụng gần đây</div>
               <div className='divide-y'>
                  {[
                     { title: 'Frontend Engineer', date: 'Hôm qua', status: 'Đang hiển thị' },
                     { title: 'Backend Engineer', date: '2 ngày trước', status: 'Tạm ẩn' },
                     { title: 'QA Engineer', date: '3 ngày trước', status: 'Đang hiển thị' }
                  ].map((job, idx) => (
                     <div key={idx} className='flex items-center justify-between p-4 text-sm'>
                        <div className='min-w-0'>
                           <div className='truncate font-medium'>{job.title}</div>
                           <div className='text-gray-500'>{job.date}</div>
                        </div>
                        <div className={`rounded-full px-2 py-1 text-xs ${
                           job.status === 'Đang hiển thị' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                           {job.status}
                        </div>
                     </div>
                  ))}
               </div>
               <div className='p-4'>
                  <Link href='/job/save' className='text-sm text-primary hover:underline'>
                     Xem tất cả tin tuyển dụng
                  </Link>
               </div>
            </div>

            <div className='rounded-md border bg-white'>
               <div className='border-b p-4 text-sm font-semibold'>Ứng viên mới</div>
               <div className='divide-y'>
                  {[
                     { name: 'Nguyễn Văn A', position: 'Frontend Engineer', time: '2 giờ trước' },
                     { name: 'Trần Thị B', position: 'Backend Engineer', time: 'Hôm qua' },
                     { name: 'Lê Văn C', position: 'QA Engineer', time: '2 ngày trước' }
                  ].map((cv, idx) => (
                     <div key={idx} className='flex items-center justify-between p-4 text-sm'>
                        <div className='min-w-0'>
                           <div className='truncate font-medium'>{cv.name}</div>
                           <div className='truncate text-gray-500'>{cv.position}</div>
                        </div>
                        <div className='text-gray-500'>{cv.time}</div>
                     </div>
                  ))}
               </div>
               <div className='p-4'>
                  <Link href='/job/save' className='text-sm text-primary hover:underline'>
                     Xem tất cả ứng viên
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

function StatCard({ icon: Icon, label, value, delta }: { icon: any; label: string; value: string; delta: string }) {
   return (
      <div className='rounded-md border bg-white p-4'>
         <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
               <Icon size={16} />
               {label}
            </div>
            <div className='text-xs text-gray-500'>
               {delta}
            </div>
         </div>
         <div className='mt-2 text-2xl font-bold'>{value}</div>
      </div>
   )
}

function ApplicationsChart() {
   const data = [6, 10, 8, 14, 12, 18, 16, 22]
   const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']

   const width = 800
   const height = 240
   const paddingX = 32
   const paddingY = 24
   const innerWidth = width - paddingX * 2
   const innerHeight = height - paddingY * 2
   const maxY = Math.max(...data) * 1.2

   const points = data
      .map((value, index) => {
         const x = paddingX + (index / (data.length - 1)) * innerWidth
         const y = paddingY + innerHeight - (value / maxY) * innerHeight
         return `${x},${y}`
      })
      .join(' ')

   const areaPoints = `${paddingX},${paddingY + innerHeight} ${points} ${paddingX + innerWidth},${paddingY + innerHeight}`

   return (
      <div className='w-full overflow-x-auto'>
         <svg width={width} height={height} className='min-w-full'>
            <defs>
               <linearGradient id='areaGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='rgb(59 130 246)' stopOpacity='0.25' />
                  <stop offset='100%' stopColor='rgb(59 130 246)' stopOpacity='0' />
               </linearGradient>
            </defs>

            <g>
               <line x1={paddingX} y1={paddingY + innerHeight} x2={paddingX + innerWidth} y2={paddingY + innerHeight} stroke='#e5e7eb' />
               {data.map((_, i) => (
                  <line
                     key={i}
                     x1={paddingX + (i / (data.length - 1)) * innerWidth}
                     y1={paddingY}
                     x2={paddingX + (i / (data.length - 1)) * innerWidth}
                     y2={paddingY + innerHeight}
                     stroke='#f3f4f6'
                  />
               ))}
            </g>

            <polygon points={areaPoints} fill='url(#areaGradient)' />
            <polyline points={points} fill='none' stroke='rgb(59 130 246)' strokeWidth='2' />

            {data.map((value, index) => {
               const x = paddingX + (index / (data.length - 1)) * innerWidth
               const y = paddingY + innerHeight - (value / maxY) * innerHeight
               return <circle key={index} cx={x} cy={y} r='3' fill='rgb(59 130 246)' />
            })}

            {labels.map((label, index) => {
               const x = paddingX + (index / (labels.length - 1)) * innerWidth
               return (
                  <text key={index} x={x} y={height - 4} textAnchor='middle' fontSize='10' fill='#6b7280'>
                     {label}
                  </text>
               )
            })}
         </svg>
      </div>
   )
}


