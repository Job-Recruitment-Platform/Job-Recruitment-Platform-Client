import { JobType } from '@/types/job.type'
import { create } from 'zustand'

type SavedJobsState = {
   jobs: JobType[]
   setJobs: (jobs: JobType[]) => void
   addJob: (job: JobType) => void
   removeJob: (id: number) => void
}

export const useSavedJobsStore = create<SavedJobsState>((set) => ({
   jobs: [],
   setJobs: (jobs) => set({ jobs }),

   addJob: (job) =>
      set((state) => {
         const exists = state.jobs.some((j) => j.id === job.id)
         return exists ? state : { jobs: [...state.jobs, job] }
      }),

   removeJob: (id: number) =>
      set((state) => ({
         jobs: state.jobs.filter((j) => j.id !== id)
      }))
}))
