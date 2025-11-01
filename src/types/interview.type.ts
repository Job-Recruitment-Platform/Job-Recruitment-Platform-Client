import { CompanyLocationResponse } from "./company.type";

export interface CreateInterviewRequest {
  applicationId: number;   // Long -> number
  scheduledAt: string;     // OffsetDateTime -> ISO 8601 string
  locationId: number;      // Long -> number
}

export interface InterviewResponse {
  id: number;                  // Long -> number
  applicationId: number;       // Long -> number
  candidateName: string;
  scheduledAt: string;         // OffsetDateTime -> ISO 8601 string
  status: InterviewStatus;     // enum
  location: Location;
  notes?: string;              // có thể null/optional
  dateCreated: string;         // OffsetDateTime -> string
  dateUpdated: string;         // OffsetDateTime -> string
}

export interface UpdateInterviewRequest {
  interviewId: number;        // Long -> number
  scheduledAt?: string;       // OffsetDateTime -> ISO 8601 string (optional nếu chỉ update 1 phần)
  status?: InterviewStatus;   // enum
  notes?: string;
  locationId?: number;        // Long -> number
}


export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_SHOW = 'NO_SHOW'
}