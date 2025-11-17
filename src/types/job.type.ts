import { SkillResponse } from './skill.type'
import { ResourceResponse } from './resource.type'

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
   logo: string
   company: string
   location: string
   salaryMax: number
   salaryMin: number
   currency: string
   jobRole: string
   minExperienceYears: number
   seniority: 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'MANAGER'
   workMode: 'ONSITE' | 'REMOTE' | 'HYBRID'
   status: JobStatus
   skills: SkillResponse[]
   datePosted: number
   dateExpires: number
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
   status: JobStatus
   summary: string
   responsibilities: string
   requirements: string
   niceToHave: string
   benefits: string
   hiringProcess: string
   notes: string
   skills: SkillResponse[]
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
   jobRole: string
   seniority: 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER'
   minExperienceYears: number
   location: string
   workMode: 'ONSITE' | 'REMOTE' | 'HYBRID'
   salaryMin?: number
   salaryMax?: number
   currency: string
   maxCandidates?: number
   datePosted: string // ISO 8601 format
   dateExpires: string // ISO 8601 format
   status: JobStatus
   skills: SkillResponse[]
}

export interface JobDetailResponse extends JobResponse {
   summary: string
   responsibilities: string
   requirements: string
   niceToHave: string
   benefits: string
   hiringProcess: string
   notes: string
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

export interface SavedJobType {
   id: number
   job: JobDetail
   savedAt: Date
}

export enum JobStatus {
   DRAFT = 'DRAFT',
   PENDING = 'PENDING',
   PUBLISHED = 'PUBLISHED',
   EXPIRED = 'EXPIRED',
   CANCELED = 'CANCELED'
}

// Job action type

export interface CreateJobRequest {
   title: string
   jobRoleId: number
   seniorityLevel: 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER' // adjust as needed
   employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP' // adjust as needed
   minExperienceYears: number
   locationId: number
   workMode: 'ONSITE' | 'REMOTE' | 'HYBRID' // adjust as needed
   salaryMin?: number
   salaryMax?: number
   currency: string
   maxCandidates?: number
   dateExpires: string // ISO 8601 format
   summary: string
   responsibilities: string
   requirements: string
   niceToHave: string
   benefits: string
   hiringProcess: string
   notes: string
   saveAsDraft: boolean
   skills: string[]
}

export interface UpdateJobRequest {
   title: string
   jobRoleId: number
   seniorityLevel: 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER'
   employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'VOLUNTEER' | 'TEMPORARY' // adjust as needed
   minExperienceYears: number
   locationId: number
   workMode: 'ONSITE' | 'REMOTE' | 'HYBRID'
   salaryMin: number
   salaryMax: number
   currency: 'USD' | 'VND' | string // extend as needed
   dateExpires: string
   summary: string
   responsibilities: string
   requirements: string
   niceToHave: string
   benefits: string
   hiringProcess: string
   notes: string
   skills: string[]
}

// Job applicant type
export interface JobApplicantResponse {
   id: number
   jobId: number
   candidateId: number
   candidateName: string
   email: string
   phone: string
   status: ApplicationStatus
   resource: ResourceResponse[]
}

export enum ApplicationStatus {
   SUBMITTED = 'SUBMITTED',
   REVIEWED = 'REVIEWED',
   INTERVIEW = 'INTERVIEW',
   OFFERED = 'OFFERED',
   REJECTED = 'REJECTED'
}

export enum ModerateAction {
   APPROVE = 'APPROVE',
   REJECT = 'REJECT'
}
