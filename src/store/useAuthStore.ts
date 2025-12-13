import { create } from 'zustand'

interface AuthState {
   isLogin: boolean
   setIsLogin: (value: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
   isLogin: false,
   setIsLogin: (value: boolean) => set({ isLogin: value })
}))
