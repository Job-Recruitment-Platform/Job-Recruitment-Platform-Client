'use client'

import { useQuery } from '@tanstack/react-query'
import { companyService } from '@/services/company.service'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, MapPin, Globe, Phone, Mail, Users, Building2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CompanyProfileDialogProps {
   companyId: number
   open: boolean
   onClose: () => void
}

export default function CompanyProfileDialog({
   companyId,
   open,
   onClose
}: Readonly<CompanyProfileDialogProps>) {
   const { data: company, isLoading } = useQuery({
      queryKey: ['company-profile', companyId],
      queryFn: async () => {
         const response = await companyService.getCompanyProfile(companyId)
         return response.data
      },
      enabled: open
   })

   const headquarters = company?.companyLocations?.find((loc) => loc.isHeadquarter)

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Hồ sơ công ty</DialogTitle>
            </DialogHeader>

            {isLoading ? (
               <div className='flex items-center justify-center py-12'>
                  <Loader2 className='text-primary h-8 w-8 animate-spin' />
               </div>
            ) : (
               <div className='space-y-6'>
                  {/* Header */}
                  <div className='flex items-start gap-4'>
                     <Avatar className='h-16 w-16'>
                        <AvatarImage src={company?.resource?.url} />
                        <AvatarFallback className='text-xl'>
                           <Building2 />
                        </AvatarFallback>
                     </Avatar>
                     <div className='flex-1'>
                        <h3 className='text-lg font-semibold'>{company?.name}</h3>
                        <div className='mt-1 flex flex-wrap gap-2 text-sm text-gray-600'>
                           <span className='flex items-center gap-1'>
                              <Users size={14} />
                              {company?.size}
                           </span>
                           <span>•</span>
                           <span>{company?.industry}</span>
                        </div>
                     </div>
                  </div>

                  {/* Contact Info */}
                  <div className='grid gap-3 rounded-lg border p-4'>
                     <h4 className='text-sm font-semibold'>Thông tin liên hệ</h4>
                     <div className='space-y-2 text-sm'>
                        {company?.email && (
                           <div className='flex items-center gap-2 text-gray-600'>
                              <Mail size={16} />
                              {company.email}
                           </div>
                        )}
                        {company?.phone && (
                           <div className='flex items-center gap-2 text-gray-600'>
                              <Phone size={16} />
                              {company.phone}
                           </div>
                        )}
                        {company?.website && (
                           <div className='flex items-center gap-2 text-gray-600'>
                              <Globe size={16} />
                              <a
                                 href={company.website}
                                 target='_blank'
                                 rel='noopener noreferrer'
                                 className='text-primary hover:underline'
                              >
                                 {company.website}
                              </a>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Headquarters */}
                  {headquarters && (
                     <div className='rounded-lg border p-4'>
                        <h4 className='mb-2 text-sm font-semibold'>Trụ sở chính</h4>
                        <div className='flex items-start gap-2 text-sm text-gray-600'>
                           <MapPin size={16} className='mt-0.5 shrink-0' />
                           <span>
                              {headquarters.location.streetAddress}, {headquarters.location.ward},{' '}
                              {headquarters.location.district}, {headquarters.location.provinceCity}
                           </span>
                        </div>
                     </div>
                  )}

                  {/* Description */}
                  {company?.description && (
                     <div className='rounded-lg border p-4'>
                        <h4 className='mb-2 text-sm font-semibold'>Giới thiệu</h4>
                        <p className='text-sm whitespace-pre-wrap text-gray-600'>
                           {company.description}
                        </p>
                     </div>
                  )}

                  {/* All Locations */}
                  {company?.companyLocations && company.companyLocations.length > 0 && (
                     <div className='rounded-lg border p-4'>
                        <h4 className='mb-2 text-sm font-semibold'>Tất cả địa điểm</h4>
                        <div className='space-y-2'>
                           {company.companyLocations.map((loc, idx) => (
                              <div
                                 key={idx}
                                 className='flex items-start gap-2 text-sm text-gray-600'
                              >
                                 <MapPin size={16} className='mt-0.5 shrink-0' />
                                 <div>
                                    <span>
                                       {loc.location.streetAddress}, {loc.location.ward},{' '}
                                       {loc.location.district}, {loc.location.provinceCity}
                                    </span>
                                    {loc.isHeadquarter && (
                                       <span className='bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs'>
                                          Trụ sở chính
                                       </span>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            )}
         </DialogContent>
      </Dialog>
   )
}
