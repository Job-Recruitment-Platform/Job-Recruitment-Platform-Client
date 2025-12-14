'use client'

import Button from '@/components/shared/Button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDownIcon, MapPinIcon, SearchIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

type LocationType = {
   name: string
   code: number
   division_type: string
   codename: string
   phone_code: number
}

type MultiLocationSelectionProps = {
   selectedLocation?: string | null
   onLocationChange?: (location: string | null) => void
}

export default function MultiLocationSelection({
   selectedLocation,
   onLocationChange
}: MultiLocationSelectionProps) {
   const [locations, setLocations] = useState<LocationType[]>([])
   const [filteredLocations, setFilteredLocations] = useState<LocationType[]>([])
   const [searchTerm, setSearchTerm] = useState('')
   const [isLoading, setIsLoading] = useState(true)
   const [open, setOpen] = useState(false)

   useEffect(() => {
      fetchLocations()
   }, [])

   useEffect(() => {
      if (searchTerm.trim() === '') {
         setFilteredLocations(locations)
      } else {
         const filtered = locations.filter((location) =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
         )
         setFilteredLocations(filtered)
      }
   }, [searchTerm, locations])

   const fetchLocations = async () => {
      try {
         const res = await fetch('https://provinces.open-api.vn/api/p/')
         const data: LocationType[] = await res.json()

         // Remove "Tỉnh" and "Thành phố" from location names
         const cleanedData = data.map((location) => ({
            ...location,
            name: location.name.replace(/^(Tỉnh|Thành phố)\s+/, '')
         }))

         setLocations(cleanedData)
         setFilteredLocations(cleanedData)
      } catch (error) {
         console.error('Error fetching locations:', error)
      } finally {
         setIsLoading(false)
      }
   }

   const handleLocationClick = (locationName: string) => {
      setOpen(false)
      setSearchTerm('')
      onLocationChange?.(locationName)
   }

   const handleClearLocation = (e: React.MouseEvent) => {
      e.stopPropagation()
      onLocationChange?.(null)
   }

   return (
      <div className='border-r pr-2'>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               {selectedLocation ? (
                  <Button
                     variant='outline'
                     className='justify-start rounded-full border-0 bg-gray-200 px-4 py-2.5'
                  >
                     <MapPinIcon size={16} />
                     <span className='max-w-[120px] truncate'>{selectedLocation}</span>
                     <div
                        onClick={handleClearLocation}
                        className='ml-1 cursor-pointer rounded-full bg-gray-200/80 p-1 transition-colors'
                     >
                        <XIcon size={12} />
                     </div>
                     <ChevronDownIcon size={14} className='ml-1' />
                  </Button>
               ) : (
                  <Button
                     variant='outline'
                     className='justify-start rounded-full border-0 bg-gray-200 px-10 py-2.5'
                  >
                     <MapPinIcon size={16} />
                     <span>Địa điểm</span>
                  </Button>
               )}
            </PopoverTrigger>
            <PopoverContent
               className='mt-1 w-[280px] p-0'
               align='start'
               sideOffset={8}
               alignOffset={-20}
            >
               {/* Search Input */}
               <div className='border-b p-2'>
                  <div className='border-primary flex items-center rounded-full border px-3 py-1.5'>
                     <SearchIcon size={16} className='text-gray-400' />
                     <Input
                        type='text'
                        placeholder='Nhập Tỉnh/Thành phố'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='h-auto border-0 bg-transparent p-0 pl-2 text-sm shadow-none focus-visible:ring-0'
                     />
                  </div>
               </div>

               {/* Location List */}
               <div className='max-h-[300px] overflow-y-auto'>
                  {isLoading ? (
                     <div className='p-4 text-center text-sm text-gray-500'>Đang tải...</div>
                  ) : filteredLocations.length === 0 ? (
                     <div className='p-4 text-center text-sm text-gray-500'>
                        Không tìm thấy địa điểm
                     </div>
                  ) : (
                     filteredLocations.map((location) => (
                        <div
                           key={location.code}
                           onClick={() => handleLocationClick(location.name)}
                           className='cursor-pointer px-4 py-2 transition-colors hover:bg-gray-50'
                        >
                           <span className='text-sm text-gray-700'>{location.name}</span>
                        </div>
                     ))
                  )}
               </div>
            </PopoverContent>
         </Popover>
      </div>
   )
}
