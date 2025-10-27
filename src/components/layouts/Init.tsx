'use client'

import candidateService from '@/services/candidate.service'
import { useEffect } from 'react'

export default function Init() {
   useEffect(() => {
      candidateService.getSavedJobs()
   }, [])

   return <></>
}
