import { create } from 'zustand'

interface AuthState {
   isLogin: boolean
   role: string | null
   setIsLogin: (value: boolean) => void
   setRole: (value: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
   isLogin: false,
   role: null,
   setIsLogin: (value: boolean) => set({ isLogin: value }),
   setRole: (value: string | null) => set({ role: value })
}))
