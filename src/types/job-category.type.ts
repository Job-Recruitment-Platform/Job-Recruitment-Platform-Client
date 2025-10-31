export interface JobFamily {
  id: number;
  name: string;
  slug: string;
  dateCreated: string; // ISO 8601 format
  dateUpdated: string; // ISO 8601 format
  subFamilies: SubFamily[];
}

export interface SubFamily {
  id: number;
  name: string;
  jobFamilyId: number;
  dateCreated: string; // ISO 8601 format
  dateUpdated: string; // ISO 8601 format
  jobRoles: JobRole[];
}

export interface JobRole {
  id: number;
  name: string;
  subFamilyId: number;
  dateCreated: string; // ISO 8601 format
  dateUpdated: string; // ISO 8601 format
}
