export interface ResourceResponse {
  [x: string]: string | number | Date;
  resourceName: ReactNode;
  id: number;
  mimeType: string;
  resourceType: ResourceType;
  contentType: string;
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