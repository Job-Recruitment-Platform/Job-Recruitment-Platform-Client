import { JobResponse } from './job.type'

export interface StatisticResponse {
   currentPublishJobCount: number

   totalNewApplicationCount: number

   totalPendingApplicationCount: number

   weeklyApplicationCount: Record<number, number>

   newestJobs: Array<JobResponse>

   newestJobApplications: Array<NewestJobApplication>
}

export interface AdminStatisticResponse {
   totalAccount: number
   totalCandidate: number
   totalRecruiter: number
   totalCompany: number
   totalJob: number
   pendingCompanyVerification: number
   pendingJobApproval: number
   weeklyNewAccount: number
   weeklyNewJob: number
}

interface NewestJobApplication {
   jobTitle: string
   candidateName: string
   appliedAt: string
}
