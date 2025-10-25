/**
 * Authentication Request Types
 */
export interface LoginRequest {
   email: string
   password: string
}

export interface RegisterRequest {
   email: string
   fullName: string
   password: string
}

export interface RegisterFormRequest extends RegisterRequest {
   confirmPassword: string
}

export interface RecruiterRegisterRequest {
   fullName: string
   email: string
   password: string
   companyName: string
}

export interface RefreshTokenRequest {
   refreshToken: string
}

/**
 * Authentication Response Types
 */
export interface TokenResponse {
   accessToken: string
   refreshToken: string
}

export interface UserResponse {
   id: number
   email: string
   fullName?: string
   roleName: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'
   status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
   provider: 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'LINKEDIN'
   dateCreated: string
}

/**
 * Internal authentication state
 */
export interface AuthUser {
   id: number
   email: string
   fullName?: string
   role: string
   status: string
}
