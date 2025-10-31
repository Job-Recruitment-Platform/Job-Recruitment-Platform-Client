export interface ResourceResponse {
  id: number;
  mimeType: string;
  resourceType: ResourceType;
  url: string;
  publicId: string;
  name: string;
  uploadedAt: string;
}

export enum ResourceType {
    AVATAR = 'AVATAR',
    COMPANY_LOGO = 'COMPANY_LOGO',
    CV = 'CV',
    JOB_ATTACHMENT = 'JOB_ATTACHMENT'
}