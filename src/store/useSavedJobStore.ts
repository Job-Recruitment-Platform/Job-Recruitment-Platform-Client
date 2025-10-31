import { SavedJobType } from '@/types/job.type'
import { create } from 'zustand'

type SavedJobsState = {
   jobs: SavedJobType[]
   setJobs: (jobs: SavedJobType[]) => void
   addJob: (job: SavedJobType) => void
   removeJob: (jobId: number) => void
}

// test test
export const useSavedJobsStore = create<SavedJobsState>((set) => ({
   jobs: [],
   setJobs: (jobs) => set({ jobs }),

   addJob: (job) =>
      set((state) => {
         const exists = state.jobs.some((j) => j.job.id === job.job.id)
         return exists ? state : { jobs: [...state.jobs, job] }
      }),

   removeJob: (jobId: number) =>
      set((state) => ({
         jobs: state.jobs.filter((j) => j.job.id !== jobId)
      }))
}))
