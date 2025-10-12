export interface LoginType {
   email: string
   password: string
}

export interface RegisterType {
   email: string
   fullName: string
   password: string
}

export interface RegisterFormType extends RegisterType {
   confirmPassword: string
}

export interface UserData {
   id: number
   email: string
   roleName: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'
   status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
   provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'LINKEDIN'
   dateCreated: string
}

export interface RegisterResponseData {
   id: number
   email: string
   roleName: string
   status: string
   provider: string
   dateCreated: string
}

export interface LoginResponseData {
   accessToken: string
   refreshToken: string
}

export interface RefreshTokenRequest {
   refreshToken: string
}

export interface RefreshTokenResponseData {
   accessToken: string
   refreshToken: string
}

export interface AuthUser {
   id: number
   email: string
   fullName?: string
   role: string
   status: string
}
