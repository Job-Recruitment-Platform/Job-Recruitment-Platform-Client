'use client'

import apiClient from '@/lib/axios'
import { create } from 'zustand'

// ====== Event types (server receives UPPERCASE) ======
export type EventType =
   | 'APPLY'
   | 'SAVE'
   | 'CLICK'
   | 'CLICK_FROM_SEARCH'
   | 'CLICK_FROM_SIMILAR'
   | 'CLICK_FROM_RECOMMENDED'
   | 'SKIP_FROM_SEARCH'
   | 'SKIP_FROM_SIMILAR'
   | 'SKIP_FROM_RECOMMENDED'

type Source = 'search' | 'similar' | 'recommended'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Meta = Record<string, any>
type ISO = string

// Action buckets (active behaviors)
type ActionBucket = Record<number, { date: ISO; metadata?: Meta; source?: Source; query?: string }>

// Skip buckets (impressions -> if not removed will become SKIP)
type SkipBucket = Record<number, { date: ISO }>
type SkipSearchBucket = Record<string, { jobId: number; query: string; date: ISO }> // key = jobId::query

type SendItem = {
   job_id: number
   event_type: EventType
   metadata: Meta
   occurred_at: ISO
}

type LogStore = {
   // gate
   isLoggedIn: boolean
   setLoggedIn: (v: boolean) => void

   // buckets
   applied: ActionBucket
   saved: ActionBucket
   clicked: ActionBucket

   skipSimilar: SkipBucket
   skipRecommended: SkipBucket
   skipSearch: SkipSearchBucket

   // init impressions
   initBucket: (source: Source, jobIds: number[], meta?: { query?: string }) => void

   // mark actions
   markApply: (jobId: number, metadata?: Meta) => void
   markSave: (jobId: number, metadata?: Meta) => void
   markClick: (args: { jobId: number; source?: Source; query?: string; metadata?: Meta }) => void

   // flush
   flushNow: () => Promise<void>
   startAutoFlush: (intervalMs?: number) => void
   stopAutoFlush: () => void
   onLogout: () => Promise<void>

   // clear
   clearBuckets: () => void

   // internal
   _timerId: number | null
   _hooksAttached: boolean
}

// ====== Config ======
const DEFAULT_INTERVAL = 60_000
const MAX_BUCKET_SIZE = 2000

const nowIso = () => new Date().toISOString()
const compositeKey = (jobId: number, query: string) => `${jobId}::${query.trim()}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pruneObj<T extends object>(obj: Record<string, any>, keep = MAX_BUCKET_SIZE) {
   const keys = Object.keys(obj)
   if (keys.length <= keep) return obj
   const drop = keys.length - keep
   for (let i = 0; i < drop; i++) delete obj[keys[i]]
   return obj
}

export async function sendBatch(items: SendItem[]) {
   try {
      console.log('Sending batch of interaction items:', items)
      await apiClient.post('/interactions', items) 
   } catch (err) {
      if (process.env.NODE_ENV === 'development') console.warn('sendBatch failed', err)
   }
}

export const useLogStore = create<LogStore>()((set, get) => ({
   isLoggedIn: false,
   setLoggedIn: (v) => set({ isLoggedIn: v }),

   applied: {},
   saved: {},
   clicked: {},

   skipSimilar: {},
   skipRecommended: {},
   skipSearch: {},

   _timerId: null,
   _hooksAttached: false,

   // ========== 1) INIT IMPRESSIONS ==========
   initBucket: (source, jobIds, meta) =>
      set((state) => {
         if (!state.isLoggedIn || !Array.isArray(jobIds) || jobIds.length === 0) return state
         const t = nowIso()

         if (source === 'search') {
            const query = (meta?.query ?? '').trim()
            if (!query) return state
            const next = { ...state.skipSearch }
            for (const id of jobIds) {
               const key = compositeKey(id, query)
               if (!next[key]) next[key] = { jobId: id, query, date: t }
            }
            pruneObj(next)
            return { ...state, skipSearch: next }
         }

         if (source === 'similar') {
            const next = { ...state.skipSimilar }
            for (const id of jobIds) if (!next[id]) next[id] = { date: t }
            pruneObj(next)
            return { ...state, skipSimilar: next }
         }

         if (source === 'recommended') {
            const next = { ...state.skipRecommended }
            for (const id of jobIds) if (!next[id]) next[id] = { date: t }
            pruneObj(next)
            return { ...state, skipRecommended: next }
         }

         return state
      }),

   // ========== 2) ACTIONS & UNSKIP ==========
   markApply: (jobId, metadata) =>
      set((state) => {
         if (!state.isLoggedIn) return state
         const t = nowIso()

         const applied = { ...state.applied }
         if (!applied[jobId]) applied[jobId] = { date: t, metadata }

         const skipSimilar = { ...state.skipSimilar }
         const skipRecommended = { ...state.skipRecommended }
         delete skipSimilar[jobId]
         delete skipRecommended[jobId]

         const skipSearch = { ...state.skipSearch }
         for (const k of Object.keys(skipSearch)) {
            if (skipSearch[k].jobId === jobId) delete skipSearch[k]
         }

         return { ...state, applied, skipSimilar, skipRecommended, skipSearch }
      }),

   markSave: (jobId, metadata) =>
      set((state) => {
         if (!state.isLoggedIn) return state
         const t = nowIso()

         const saved = { ...state.saved }
         if (!saved[jobId]) saved[jobId] = { date: t, metadata }

         const skipSimilar = { ...state.skipSimilar }
         const skipRecommended = { ...state.skipRecommended }
         delete skipSimilar[jobId]
         delete skipRecommended[jobId]

         const skipSearch = { ...state.skipSearch }
         for (const k of Object.keys(skipSearch)) {
            if (skipSearch[k].jobId === jobId) delete skipSearch[k]
         }

         return { ...state, saved, skipSimilar, skipRecommended, skipSearch }
      }),

   // CLICK creates 2 events: CLICK + CLICK_FROM_*
   markClick: ({ jobId, source, query, metadata }) =>
      set((state) => {
         if (!state.isLoggedIn) return state
         const t = nowIso()

         const clicked = { ...state.clicked }
         if (!clicked[jobId])
            clicked[jobId] = {
               date: t,
               metadata: { ...(metadata ?? {}), source, query },
               source,
               query
            }

         const skipSimilar = { ...state.skipSimilar }
         const skipRecommended = { ...state.skipRecommended }
         const skipSearch = { ...state.skipSearch }

         if (source === 'search') {
            if (query && query.trim()) {
               const key = compositeKey(jobId, query)
               delete skipSearch[key]
            } else {
               for (const k of Object.keys(skipSearch)) {
                  if (skipSearch[k].jobId === jobId) delete skipSearch[k]
               }
            }
         } else if (source === 'similar') {
            delete skipSimilar[jobId]
         } else if (source === 'recommended') {
            delete skipRecommended[jobId]
         } else {
            // unknown source -> remove from all skip buckets
            delete skipSimilar[jobId]
            delete skipRecommended[jobId]
            for (const k of Object.keys(skipSearch)) {
               if (skipSearch[k].jobId === jobId) delete skipSearch[k]
            }
         }

         return { ...state, clicked, skipSimilar, skipRecommended, skipSearch }
      }),

   // ========== 3) FLUSH ==========
   flushNow: async () => {
      const s = get()
      if (!s.isLoggedIn) return

      const items: SendItem[] = []

      // APPLY
      for (const [id, v] of Object.entries(s.applied)) {
         items.push({
            job_id: Number(id),
            event_type: 'APPLY',
            metadata: v.metadata ?? {},
            occurred_at: v.date
         })
      }
      // SAVE
      for (const [id, v] of Object.entries(s.saved)) {
         items.push({
            job_id: Number(id),
            event_type: 'SAVE',
            metadata: v.metadata ?? {},
            occurred_at: v.date
         })
      }
      // CLICK => generates 2 events: CLICK + CLICK_FROM_*
      for (const [id, v] of Object.entries(s.clicked)) {
         const from: EventType =
            v.source === 'search'
               ? 'CLICK_FROM_SEARCH'
               : v.source === 'similar'
                 ? 'CLICK_FROM_SIMILAR'
                 : v.source === 'recommended'
                   ? 'CLICK_FROM_RECOMMENDED'
                   : 'CLICK'

         // CLICK (total)
         items.push({
            job_id: Number(id),
            event_type: 'CLICK',
            metadata: v.metadata ?? {},
            occurred_at: v.date
         })
         // CLICK_FROM_* (if source can be determined)
         if (from !== 'CLICK') {
            items.push({
               job_id: Number(id),
               event_type: from,
               metadata: v.metadata ?? {},
               occurred_at: v.date
            })
         }
      }

      // SKIP_FROM_SIMILAR
      for (const [id, v] of Object.entries(s.skipSimilar)) {
         items.push({
            job_id: Number(id),
            event_type: 'SKIP_FROM_SIMILAR',
            metadata: {},
            occurred_at: v.date
         })
      }
      // SKIP_FROM_RECOMMENDED
      for (const [id, v] of Object.entries(s.skipRecommended)) {
         items.push({
            job_id: Number(id),
            event_type: 'SKIP_FROM_RECOMMENDED',
            metadata: {},
            occurred_at: v.date
         })
      }
      // SKIP_FROM_SEARCH (with query)
      for (const [, v] of Object.entries(s.skipSearch)) {
         items.push({
            job_id: v.jobId,
            event_type: 'SKIP_FROM_SEARCH',
            metadata: { query: v.query },
            occurred_at: v.date
         })
      }

      if (items.length === 0) return

      await sendBatch(items)

      // reset after sending
      set({
         applied: {},
         saved: {},
         clicked: {},
         skipSimilar: {},
         skipRecommended: {},
         skipSearch: {}
      })
   },

   startAutoFlush: (intervalMs = DEFAULT_INTERVAL) => {
      const st = get()
      if (!st._hooksAttached) {
         const onHide = () => get().flushNow()
         document.addEventListener('visibilitychange', onHide)
         window.addEventListener('beforeunload', onHide)
         set({ _hooksAttached: true })
      }
      if (st._timerId == null) {
         const id = window.setInterval(() => get().flushNow(), intervalMs)
         set({ _timerId: id as unknown as number })
      }
   },

   stopAutoFlush: () => {
      const id = get()._timerId
      if (id != null) {
         clearInterval(id)
         set({ _timerId: null })
      }
   },

   onLogout: async () => {
      await get().flushNow()
      set({
         isLoggedIn: false,
         applied: {},
         saved: {},
         clicked: {},
         skipSimilar: {},
         skipRecommended: {},
         skipSearch: {}
      })
   },

   clearBuckets: () =>
      set({
         applied: {},
         saved: {},
         clicked: {},
         skipSimilar: {},
         skipRecommended: {},
         skipSearch: {}
      })
}))
