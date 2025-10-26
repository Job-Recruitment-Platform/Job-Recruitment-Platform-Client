import { BaseService } from './base.service'

export interface ApplyJobRequest {
   jobId: string | number
   file: File
   coverLetter?: string
}

export interface ApplyJobResponse {
   id: number
   jobId: number
   candidateId: number
   status: string
   appliedAt: string
   message?: string
}

class CandidateService extends BaseService {
   constructor() {
      super('/candidates')
   }

   /**
    * Apply for a job
    * @param data - Application data including file and cover letter
    */
   async applyForJob(data: ApplyJobRequest): Promise<ApplyJobResponse> {
      const formData = new FormData()

      // Append file with field name 'file'
      formData.append('file', data.file, data.file.name)

      // Append cover letter if provided
      if (data.coverLetter) {
         formData.append('coverLetter', data.coverLetter)
      }

      const response = await this.post<ApplyJobResponse>(`/applications/${data.jobId}`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      })

      return response.data
   }
}
const candidateService = new CandidateService()
export default candidateService
