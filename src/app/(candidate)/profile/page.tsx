import CandidateProfile from '@/components/features/candidate/CandidateProfile'
import SettingSidebar from '@/components/features/candidate/setting-sidebar/SettingSidebar'

export default function ProfilePage() {
   return (
      <div className='bg-smoke min-h-screen w-full p-6'>
         <div className='container grid grid-cols-3 gap-x-8 px-8'>
            <div className='col-span-2'>
               <CandidateProfile />
            </div>
            <div className='col-span-1'>
               <SettingSidebar />
            </div>
         </div>
      </div>
   )
}
