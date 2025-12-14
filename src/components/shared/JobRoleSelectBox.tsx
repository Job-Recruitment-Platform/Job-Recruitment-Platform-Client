'use client'

import SelectionBox from '@/components/shared/SelectionBox'
import { useJobCategoryQuery } from '@/hooks/useJobCategoryQuery'
import { OptionType } from '@/types/option.type'
import { useMemo } from 'react'

export default function JobRoleSelectBox() {
   const { categories, isLoading } = useJobCategoryQuery(0, 20)

   // Extract all jobRoles from all categories
   const jobRoleOptions: OptionType[] = useMemo(() => {
      const roles: OptionType[] = [{ label: 'Tất cả', value: 'all' }]

      categories.forEach((category) => {
         category.subFamilies?.forEach((subFamily) => {
            subFamily.jobRoles?.forEach((jobRole) => {
               roles.push({
                  label: jobRole.name,
                  value: jobRole.name
               })
            })
         })
      })

      return roles
   }, [categories])

   if (isLoading) {
      return (
         <div className='w-full'>
            <div className='py-2 text-sm font-semibold'>Lĩnh vực công việc</div>
            <div className='h-10 w-full animate-pulse rounded-full bg-gray-200' />
         </div>
      )
   }

   return (
      <div className='w-full'>
         <SelectionBox
            header='Lĩnh vực công việc'
            options={jobRoleOptions}
            paramKey={'jobRole'}
            placeholder='Chọn lĩnh vực'
         />
      </div>
   )
}
