import JobSearchItem from "@/components/features/job/JobSearchItem"

export default function SearchResultsPage() {
   return (
      <div className='bg-smoke p-5'>
         <div className='container flex gap-x-2 px-2'>
            <div className='w-[295px]'>
               <div className='w-full text-center'>Lọc nâng cao</div>
               <div></div>
            </div>
            <div className='flex-1'>
               <JobSearchItem />
            </div>
         </div>
      </div>
   )
}
