/**
 * Job Search Request Types
 */
export interface JobSearchRequest {
   query: string
   limit: number
   offset: number
   weights?: {
      dense?: number
      sparse?: number
   }
   filters?: {
      work_mode?: 'ONSITE' | 'REMOTE' | 'HYBRID'
      seniority?: 'JUNIOR' | 'SENIOR' | 'LEAD'
   }
}

/**
 * Job Search Response Types
 */
export interface JobSearchResult {
   id: number
   title: string
   company: string
   location: string
   salary_min: number
   salary_max: number
   currency: string
   job_role: string
   min_experience_years: number
   seniority: 'JUNIOR' | 'SENIOR' | 'LEAD'
   work_mode: 'ONSITE' | 'REMOTE' | 'HYBRID'
   status: 'PUBLISHED' | 'DRAFT'
   skills: string[]
   date_posted: number
   date_expires: number
   score: number
}

export interface JobSearchResponse {
   results: JobSearchResult[]
   total?: number
   limit?: number
   offset?: number
}

/**
 * Job Detail Types
 */

export interface JobDetail {
   id: number
   title: string
   company: string
   jobRole: string
   seniority: 'INTERN' | 'JUNIOR' | 'SENIOR' | 'LEAD' | 'MANAGER'
   minExperienceYears: number
   location: string
   workMode: 'ONSITE' | 'REMOTE' | 'HYBRID'
   salaryMin: number
   salaryMax: number
   currency: string
   maxCandidates: number | null
   datePosted: string
   dateExpires: string
   status: 'PUBLISHED' | 'DRAFT' | 'EXPIRED'
   summary: string
   responsibilities: string
   requirements: string
   niceToHave: string
   benefits: string
   hiringProcess: string
   notes: string
}

export interface GetJobDetailRequest {
   jobId: number
}

export interface JobDetailResponse {
   code: number
   data: JobDetail
}

/**
 * Job display type for UI (simplified)
 */
export interface JobResponse {
   id: number
   title: string
   company: string
   location: string
   salary_min: number
   salary_max: number
   currency: string
   seniority: string
   work_mode: string
   skills: string[]
   score?: number
}

/**
 * Legacy job type (for backward compatibility)
 */
export interface JobType {
   id: number
   logo: string
   title: string
   company: string
   location: string
   salary: string
}
