'use client'

import SelectionBox from '@/components/shared/SelectionBox'
import { cn } from '@/lib/utils'
import { OptionType } from '@/types/option.type'
import { useEffect, useState } from 'react'

type LocationType = {
   name: string
   code: number
   division_type: string
   codename: string
   phone_code: number
   wards: []
}

export default function LocationSelectBox({ className = '' }: { className?: string }) {
   const [locations, setLocations] = useState<OptionType[]>([])
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      fetchLocations()
   }, [])

   const fetchLocations = async () => {
      try {
         const res = await fetch('https://provinces.open-api.vn/api/v2/')
         const data: LocationType[] = await res.json()

         const options: OptionType[] = data.map((location) => ({
            label: location.name,
            value: location.name
         }))

         setLocations(options)
      } catch (error) {
         console.error('Error fetching locations:', error)
      } finally {
         setIsLoading(false)
      }
   }

   if (isLoading) {
      return null
   }

   return (
      <div className='w-full px-0.5'>
         <SelectionBox
            options={locations}
            header='Địa điểm làm việc'
            paramKey='location'
            placeholder='Chọn địa điểm'
            className={cn('w-full', className)}
         />
      </div>
   )
}
