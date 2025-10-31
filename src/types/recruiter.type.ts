import { CompanyResponse } from "./company.type";
import { ResourceResponse } from "./resource.type";

export interface RecruiterResponse {
  id: number;
  accountId: number;
  fullName: string;
  phone: string;
  resource: ResourceResponse | null;
  company: CompanyResponse;
  dateCreated: string;
  dateUpdated: string;
}

export interface UpdateRecruiterProfileRequest {
  fullName: string;
  phone: string;
}
