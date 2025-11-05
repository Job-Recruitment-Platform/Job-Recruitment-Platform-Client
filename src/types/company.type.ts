import { ResourceResponse } from "./resource.type";

export interface CompanyRequest {
  name: string;
  website: string;
  size: string;
  companyLocations: CompanyLocationRequest[];
  description: string;
  phone: string;
  email: string;
  industry: string;
}

export interface CompanyLocationRequest {
  location: LocationRequest;
  isHeadquarter: boolean;
}

export interface LocationRequest {
  streetAddress: string;
  ward: string;
  district: string;
  provinceCity: string;
  country: string;
}

export interface CompanyResponse {
  id: number;
  name: string;
  website: string;
  size: string;
  description: string;
  phone: string;
  email: string;
  industry: string;
  resource: ResourceResponse | null;
  verified: boolean;
  dateCreated: string;
  companyLocations: CompanyLocationResponse[];
}

export interface CompanyLocationResponse {
  location: Location;
  isHeadquarter: boolean;
}

export interface Location{
    id: number;
    streetAddress: string;
    ward: string;
    district: string;
    provinceCity: string;
    country: string;
}