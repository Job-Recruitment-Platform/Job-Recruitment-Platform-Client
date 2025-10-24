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

export interface JobDetailType extends JobType {
   description: string
   requirements: string[]
   benefits: string[]
   employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN'
   experienceLevel: 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'MANAGER' | 'DIRECTOR'
   postedDate: string
   expiryDate: string
}


