'use client'

import Button from '@/components/shared/Button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { showErrorToast } from '@/lib/toast'
import candidateService from '@/services/candidate.service'
import type { CandidateProfileResponse, CandidateSkill, Seniority } from '@/types/candidate.type'
import { CalendarDays, Globe2, Mail, MapPin, Plane, Wallet } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const SENIORITY_LABELS: Record<Seniority, string> = {
   INTERN: 'Intern',
   FRESHER: 'Fresher',
   JUNIOR: 'Junior',
   MID: 'Mid-level',
   SENIOR: 'Senior',
   MANAGER: 'Manager'
}

export default function ProfilePage() {
   const [profile, setProfile] = useState<CandidateProfileResponse | null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      let mounted = true
      ;(async () => {
         try {
            const res = await candidateService.getProfile()
            if (res?.data && mounted) {
               setProfile(res.data)
            }
         } catch (err) {
            console.error('Load profile error:', err)
            showErrorToast('Không tải được hồ sơ cá nhân')
         } finally {
            if (mounted) setLoading(false)
         }
      })()
      return () => {
         mounted = false
      }
   }, [])

   const avatarUrl = useMemo(() => {
      if (!profile?.resource) return undefined
      const { resourceType, url } = profile.resource
      return resourceType === 'AVATAR' ? url : profile.resource.url
   }, [profile])

   const seniorityLabel = profile?.seniority
      ? SENIORITY_LABELS[profile.seniority] ?? profile.seniority
      : 'Chưa cập nhật'

   const salaryRange = useMemo(() => {
      if (!profile) return 'Chưa cập nhật'
      const { salaryExpectMin, salaryExpectMax, currency } = profile
      const formattedMin = formatCurrency(salaryExpectMin, currency)
      const formattedMax = formatCurrency(salaryExpectMax, currency)
      if (formattedMin && formattedMax) return `${formattedMin} - ${formattedMax}`
      if (formattedMax) return formattedMax
      if (formattedMin) return formattedMin
      return 'Chưa cập nhật'
   }, [profile])

   const locationText = useMemo(() => {
      if (!profile?.location) return 'Chưa cập nhật'
      const { streetAddress, ward, provinceCity } = profile.location
      const parts = [streetAddress, ward, provinceCity].filter(Boolean)
      return parts.length ? parts.join(', ') : 'Chưa cập nhật'
   }, [profile])

   const joinedDate = profile?.dateCreated ? formatDate(profile.dateCreated) : 'Chưa cập nhật'
   const updatedDate = profile?.dateUpdated ? formatDate(profile.dateUpdated) : 'Chưa cập nhật'

   return (
      <div className='bg-smoke min-h-screen py-6'>
         <div className='container mx-auto px-4'>
            <div className='mx-auto max-w-4xl space-y-6'>
               {loading ? (
                  <div className='flex h-64 items-center justify-center rounded-lg border bg-white'>
                     <p className='text-sm text-gray-500'>Đang tải thông tin hồ sơ...</p>
                  </div>
               ) : !profile ? (
                  <div className='flex h-64 flex-col items-center justify-center gap-2 rounded-lg border bg-white'>
                     <p className='text-sm font-medium text-gray-600'>Chưa có thông tin hồ sơ</p>
                     <Link href='/profile/edit'>
                        <Button>Thêm thông tin ngay</Button>
                     </Link>
                  </div>
               ) : (
                  <>
                     <section className='rounded-lg border bg-white p-6 shadow-sm'>
                        <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
                           <div className='flex w-full flex-1 flex-col gap-6 sm:flex-row sm:items-center'>
                              <Avatar className='h-24 w-24 shrink-0 border'>
                                 <AvatarImage src={avatarUrl || 'https://www.topcv.vn/images/avatar-default.jpg'} />
                                 <AvatarFallback className='bg-primary/10 text-primary text-xl font-semibold'>
                                    {getInitials(profile.fullName)}
                                 </AvatarFallback>
                              </Avatar>
                              <div className='min-w-0 space-y-3'>
                                 <div>
                                    <div className='flex flex-wrap items-center gap-2'>
                                       <h1 className='text-2xl font-semibold text-gray-900'>
                                          {profile.fullName}
                                       </h1>
                                       <Badge variant='outline'>{seniorityLabel}</Badge>
                                    </div>
                                    {profile.email && (
                                       <div className='mt-2 flex items-center gap-2 text-sm text-gray-500'>
                                          <Mail size={16} />
                                          <span className='truncate'>{profile.email}</span>
                                       </div>
                                    )}
                                    <div className='mt-1 flex items-center gap-2 text-sm text-gray-500'>
                                       <MapPin size={16} />
                                       <span className='truncate'>{locationText}</span>
                                    </div>
                                 </div>
                                 <div className='flex flex-wrap items-center gap-2 text-sm text-gray-600'>
                                    <Badge
                                       variant={profile.remotePref ? 'default' : 'outline'}
                                       className={profile.remotePref ? 'bg-primary text-white' : undefined}
                                    >
                                       <Globe2 size={14} />
                                       {profile.remotePref ? 'Ưu tiên làm từ xa' : 'Ưu tiên làm tại văn phòng'}
                                    </Badge>
                                    <Badge
                                       variant={profile.relocationPref ? 'default' : 'outline'}
                                       className={profile.relocationPref ? 'bg-primary text-white' : undefined}
                                    >
                                       <Plane size={14} />
                                       {profile.relocationPref ? 'Sẵn sàng đi làm xa' : 'Không muốn chuyển nơi làm việc'}
                                    </Badge>
                                 </div>
                              </div>
                           </div>
                           <div className='flex shrink-0 flex-wrap justify-end gap-3'>
                              <Link href='/profile/edit'>
                                 <Button className='w-full sm:w-auto'>Chỉnh sửa hồ sơ</Button>
                              </Link>
                              <Link href='/profile/resume'>
                                 <Button variant='outline' className='w-full sm:w-auto'>
                                    Quản lý CV
                                 </Button>
                              </Link>
                           </div>
                        </div>

                        <Separator className='my-6' />

                        <div className='grid gap-4 sm:grid-cols-2'>
                           <InfoTile
                              title='Mức lương mong muốn'
                              icon={<Wallet size={16} className='text-primary' />}
                              value={salaryRange}
                           />
                           <InfoTile
                              title='Ngày tham gia'
                              icon={<CalendarDays size={16} className='text-primary' />}
                              value={joinedDate}
                           />
                           <InfoTile
                              title='Cập nhật lần cuối'
                              icon={<CalendarDays size={16} className='text-primary' />}
                              value={updatedDate}
                           />
                           <InfoTile
                              title='Địa điểm'
                              icon={<MapPin size={16} className='text-primary' />}
                              value={locationText}
                           />
                        </div>
                     </section>

                     <section className='rounded-lg border bg-white p-6 shadow-sm'>
                        <h2 className='text-lg font-semibold text-gray-900'>Giới thiệu bản thân</h2>
                        <p className='mt-3 whitespace-pre-line text-sm leading-6 text-gray-700'>
                           {profile.bio?.trim() ? profile.bio : 'Bạn chưa cập nhật phần giới thiệu.'}
                        </p>
                     </section>

                     <section className='rounded-lg border bg-white p-6 shadow-sm'>
                        <div className='flex items-center justify-between'>
                           <h2 className='text-lg font-semibold text-gray-900'>Kỹ năng</h2>
                           <Badge variant='outline'>{profile.skills?.length ?? 0} kỹ năng</Badge>
                        </div>
                        {profile.skills?.length ? (
                           <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                              {profile.skills.map((skill, index) => (
                                 <SkillCard
                                    key={`${skill.skill?.id ?? skill.skill?.name ?? 'skill'}-${index}`}
                                    skill={skill}
                                 />
                              ))}
                           </div>
                        ) : (
                           <p className='mt-3 text-sm text-gray-600'>Bạn chưa thêm kỹ năng nào.</p>
                        )}
                     </section>
                  </>
               )}
            </div>
         </div>
      </div>
   )
}

function SkillCard({ skill }: { skill: CandidateSkill }) {
   const name = skill.skill?.name || 'Kỹ năng'
   const level = Math.min(Math.max(skill.level ?? 0, 0), 5)
   const percentage = (level / 5) * 100

   return (
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
         <div className='flex items-center justify-between gap-4'>
            <span className='font-medium text-gray-900'>{name}</span>
            <span className='text-xs font-semibold text-gray-600'>Cấp độ {level}/5</span>
         </div>
         <div className='mt-3 h-1.5 w-full rounded-full bg-gray-200'>
            <div
               className='h-full rounded-full bg-primary transition-all'
               style={{ width: `${percentage}%` }}
            />
         </div>
      </div>
   )
}

function InfoTile({
   title,
   value,
   icon
}: {
   title: string
   value: string
   icon?: React.ReactNode
}) {
   return (
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
         <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            {icon}
            <span>{title}</span>
         </div>
         <p className='mt-2 text-sm font-medium text-gray-900'>{value}</p>
      </div>
   )
}

function formatCurrency(value?: number, currency?: string) {
   if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) return ''
   try {
      return new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: currency && currency.trim() ? currency : 'VND',
         maximumFractionDigits: 0
      }).format(value)
   } catch {
      return `${value.toLocaleString()} ${currency ?? ''}`.trim()
   }
}

function formatDate(value: string) {
   const date = new Date(value)
   if (Number.isNaN(date.getTime())) return 'Chưa cập nhật'
   return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
   }).format(date)
}

function getInitials(name: string) {
   return name
      ?.split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
}

