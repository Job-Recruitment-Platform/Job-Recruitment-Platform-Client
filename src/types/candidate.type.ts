import { ResourceResponse } from "./resource.type"

export type Seniority = 'INTERN' | 'JUNIOR' | 'SENIOR' | 'LEAD'
export type ResourceType = 'AVATAR' | 'RESUME' | 'PORTFOLIO'

export interface Location {
   id: number
   streetAddress: string
   ward: string
   provinceCity: string
}

export interface Skill {
   id: number
   name: string
   dateCreated: string
}

export interface CandidateSkill {
   skill: Skill
   level: number
}


export interface CandidateProfileResponse {
   id: number
   accountId: number
   fullName: string
   email?: string
   location: Location
   seniority: Seniority
   salaryExpectMin: number
   salaryExpectMax: number
   currency: string
   remotePref: boolean
   relocationPref: boolean
   resource: ResourceResponse
   bio: string
   dateCreated: string
   dateUpdated: string
   skills: CandidateSkill[]
}

export interface UpdateCandidateProfileRequest {
   fullName: string
   location: Omit<Location, 'id'>
   seniority: Seniority
   salaryExpectMin: string
   salaryExpectMax: string
   currency: string
   remotePref: boolean
   relocationPref: boolean
   bio: string
   skills: Array<{
      skillName: string
      level: number
   }>
}
