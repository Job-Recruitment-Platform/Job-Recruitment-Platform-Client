export interface LoginType {
   email: string
   password: string
}

export interface RegisterType {
   email: string
   fullName: string
   password: string
}

// Type cho form (bao gồm confirmPassword để validate UI)
export interface RegisterFormType extends RegisterType {
   confirmPassword: string
}
