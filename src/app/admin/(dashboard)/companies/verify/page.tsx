'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { companyService } from '@/services/company.service'
import { CompanyResponse } from '@/types/company.type'
import { Loader2, Building2 } from 'lucide-react'
import Button from '@/components/shared/Button'
import CompanyProfileDialog from '@/components/features/admin/CompanyProfileDialog'
import CompanyAttestationsDialog from '@/components/features/admin/CompanyAttestationsDialog'
import VerifyCompanyDialog from '@/components/features/admin/VerifyCompanyDialog'

export default function VerifyCompaniesPage() {
   const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
   const [showProfileDialog, setShowProfileDialog] = useState(false)
   const [showAttestationsDialog, setShowAttestationsDialog] = useState(false)
   const [showVerifyDialog, setShowVerifyDialog] = useState(false)
   const queryClient = useQueryClient()

   // Fetch companies pending verification
   const { data: companiesData, isLoading } = useQuery({
      queryKey: ['companies-verify-list'],
      queryFn: async () => {
         const response = await companyService.getVerifyList()
         return response
      },
      refetchOnWindowFocus: false
   })

   const handleViewProfile = (companyId: number) => {
      setSelectedCompanyId(companyId)
      setShowProfileDialog(true)
   }

   const handleViewAttestations = (companyId: number) => {
      setSelectedCompanyId(companyId)
      setShowAttestationsDialog(true)
   }

   const handleVerify = (companyId: number) => {
      setSelectedCompanyId(companyId)
      setShowVerifyDialog(true)
   }

   const renderContent = () => {
      if (isLoading) {
         return (
            <div className='flex items-center justify-center py-12'>
               <Loader2 className='text-primary h-8 w-8 animate-spin' />
            </div>
         )
      }

      if (companies.length === 0) {
         return (
            <div className='py-12 text-center text-sm text-gray-500'>
               <Building2 className='mx-auto mb-2 h-12 w-12 text-gray-300' />
               Không có công ty nào cần xác thực
            </div>
         )
      }

      return (
         <div className='divide-y'>
            {companies.map((company: CompanyResponse) => (
               <div
                  key={company.id}
                  className='grid grid-cols-12 items-center gap-4 px-4 py-4 text-sm'
               >
                  <div className='col-span-4'>
                     <div className='font-medium'>{company.name}</div>
                     <div className='text-xs text-gray-500'>{company.email}</div>
                  </div>
                  <div className='col-span-2 text-gray-600'>{company.industry}</div>
                  <div className='col-span-2 text-gray-600'>{company.size}</div>
                  <div className='col-span-2 text-gray-600'>
                     {new Date(company.dateCreated).toLocaleDateString('vi-VN')}
                  </div>
                  <div className='col-span-2 flex items-center justify-end gap-2'>
                     <Button
                        variant='outline'
                        onClick={() => handleViewProfile(company.id)}
                        className='text-xs'
                     >
                        Hồ sơ
                     </Button>
                     <Button
                        variant='outline'
                        onClick={() => handleViewAttestations(company.id)}
                        className='text-xs'
                     >
                        Chứng thực
                     </Button>
                     <Button
                        variant='primary'
                        onClick={() => handleVerify(company.id)}
                        className='text-xs'
                     >
                        Xét duyệt
                     </Button>
                  </div>
               </div>
            ))}
         </div>
      )
   }

   const companies = companiesData?.content || []

   return (
      <div className='space-y-6'>
         <div>
            <h1 className='text-2xl font-semibold'>Xác thực công ty</h1>
            <p className='text-sm text-gray-500'>
               Xem xét hồ sơ và tài liệu chứng thực của các công ty
            </p>
         </div>

         {/* Companies List */}
         <div className='overflow-hidden rounded-md border bg-white'>
            <div className='grid grid-cols-12 gap-4 border-b px-4 py-3 text-xs font-medium text-gray-500'>
               <div className='col-span-4'>Tên công ty</div>
               <div className='col-span-2'>Ngành nghề</div>
               <div className='col-span-2'>Quy mô</div>
               <div className='col-span-2'>Ngày tạo</div>
               <div className='col-span-2 text-right'>Thao tác</div>
            </div>

            {renderContent()}
         </div>

         {/* Dialogs */}
         {selectedCompanyId && (
            <>
               <CompanyProfileDialog
                  companyId={selectedCompanyId}
                  open={showProfileDialog}
                  onClose={() => setShowProfileDialog(false)}
               />
               <CompanyAttestationsDialog
                  companyId={selectedCompanyId}
                  open={showAttestationsDialog}
                  onClose={() => setShowAttestationsDialog(false)}
               />
               <VerifyCompanyDialog
                  companyId={selectedCompanyId}
                  companyName={companies.find((c) => c.id === selectedCompanyId)?.name || ''}
                  open={showVerifyDialog}
                  onClose={() => {
                     setShowVerifyDialog(false)
                     queryClient.invalidateQueries({ queryKey: ['companies-verify-list'] })
                  }}
               />
            </>
         )}
      </div>
   )
}
