'use client'

import { useQuery } from '@tanstack/react-query'
import { companyService } from '@/services/company.service'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, FileText, ExternalLink } from 'lucide-react'
import Button from '@/components/shared/Button'

interface CompanyAttestationsDialogProps {
   companyId: number
   open: boolean
   onClose: () => void
}

export default function CompanyAttestationsDialog({
   companyId,
   open,
   onClose
}: Readonly<CompanyAttestationsDialogProps>) {
   const { data: attestations, isLoading } = useQuery({
      queryKey: ['company-attestations', companyId],
      queryFn: async () => {
         return await companyService.getCompanyAttestions(companyId)
      },
      enabled: open
   })

   const handleOpenFile = (url: string) => {
      window.open(url, '_blank')
   }

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent className='max-w-2xl'>
            <DialogHeader>
               <DialogTitle>Tài liệu chứng thực</DialogTitle>
            </DialogHeader>

            {isLoading ? (
               <div className='flex items-center justify-center py-12'>
                  <Loader2 className='text-primary h-8 w-8 animate-spin' />
               </div>
            ) : !attestations || attestations.length === 0 ? (
               <div className='py-12 text-center text-sm text-gray-500'>
                  <FileText className='mx-auto mb-2 h-12 w-12 text-gray-300' />
                  Chưa có tài liệu chứng thực
               </div>
            ) : (
               <div className='space-y-3'>
                  {attestations.map((attestation) => (
                     <div
                        key={attestation.id}
                        className='flex items-center justify-between rounded-lg border p-4'
                     >
                        <div className='flex items-center gap-3'>
                           <div className='bg-primary/10 rounded-lg p-2'>
                              <FileText className='text-primary h-5 w-5' />
                           </div>
                           <div>
                              <div className='font-medium'>{attestation.resourceName}</div>
                              <div className='text-xs text-gray-500'>
                                 {attestation.resourceType} •{' '}
                                 {new Date(attestation.dateCreated).toLocaleDateString('vi-VN')}
                              </div>
                           </div>
                        </div>
                        <Button
                           variant='outline'
                           onClick={() => handleOpenFile(attestation.url)}
                           className='gap-2'
                        >
                           <ExternalLink size={16} />
                           Xem
                        </Button>
                     </div>
                  ))}
               </div>
            )}
         </DialogContent>
      </Dialog>
   )
}
