import React, { useCallback, useMemo, useRef, useState } from 'react'

export type FileUploaderProps = {
   accept?: string[] // e.g. ["image/png","image/jpeg"] or [".png",".jpg"]
   maxSizeMB?: number // MB per file
   multiple?: boolean // if false → always keep 1 file (replace)
   fieldName?: string // form-data field name
   extraFields?: Record<string, string | number | boolean>
   uploadUrl?: string // POST multipart endpoint
}

export type UploadResult = {
   file: File
   success: boolean
   status?: number
   responseText?: string
   error?: string
}

type UploadingItem = {
   id: string
   file: File
   previewUrl?: string
   progress: number // 0..100
   state: 'queued' | 'uploading' | 'done' | 'error' | 'canceled'
   xhr?: XMLHttpRequest
   error?: string
}

export function useFileUploader({
   accept,
   maxSizeMB = 10,
   multiple = true,
   fieldName = 'file',
   extraFields,
   uploadUrl = '/api/upload'
}: FileUploaderProps) {
   const inputRef = useRef<HTMLInputElement | null>(null)
   const [dragActive, setDragActive] = useState(false)
   const [items, setItems] = useState<UploadingItem[]>([])
   const [acceptSet] = useState(() => new Set((accept ?? []).map((s) => s.toLowerCase())))

   const onBrowseClick = () => inputRef.current?.click()

   const validateFile = useCallback(
      (file: File): string | null => {
         if (acceptSet.size > 0) {
            const ext = `.${file.name.split('.').pop()?.toLowerCase()}`
            const type = file.type.toLowerCase()
            if (!acceptSet.has(ext) && !acceptSet.has(type)) {
               return `Loại file không được chấp nhận (${file.type || ext}).`
            }
         }
         if (file.size > maxSizeMB * 1024 * 1024) {
            return `File quá lớn (> ${maxSizeMB} MB).`
         }
         return null
      },
      [acceptSet, maxSizeMB]
   )

   const makePreviewUrl = (file: File) =>
      file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined

   const buildItem = (f: File): UploadingItem => {
      const err = validateFile(f)
      return {
         id: crypto.randomUUID(),
         file: f,
         previewUrl: makePreviewUrl(f),
         progress: 0,
         state: err ? 'error' : 'queued',
         error: err ?? undefined
      }
   }

   const addFiles = useCallback(
      (files: FileList | File[]) => {
         const list = Array.from(files)
         if (!multiple) {
            const f = list[list.length - 1]
            setItems([buildItem(f)])
            return
         }
         const next = list.map(buildItem)
         setItems((prev) => [...prev, ...next])
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [multiple]
   )

   const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files)
      e.target.value = ''
   }

   const onDrop = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
         addFiles(e.dataTransfer.files)
      }
   }
   const onDragOver = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(true)
   }
   const onDragLeave = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
   }

   const uploadOne = useCallback(
      (item: UploadingItem): Promise<UploadResult> => {
         return new Promise((resolve) => {
            const fd = new FormData()
            fd.append(fieldName, item.file, item.file.name)
            if (extraFields) {
               Object.entries(extraFields).forEach(([k, v]) => fd.append(k, String(v)))
            }
            const xhr = new XMLHttpRequest()
            xhr.open('POST', uploadUrl)
            xhr.upload.onprogress = (evt) => {
               if (!evt.lengthComputable) return
               const pct = Math.round((evt.loaded / evt.total) * 100)
               setItems((prev) =>
                  prev.map((it) => (it.id === item.id ? { ...it, progress: pct } : it))
               )
            }
            xhr.onload = () => {
               const ok = xhr.status >= 200 && xhr.status < 300
               setItems((prev) =>
                  prev.map((it) =>
                     it.id === item.id
                        ? {
                             ...it,
                             state: ok ? 'done' : 'error',
                             xhr: undefined,
                             error: ok ? undefined : xhr.responseText
                          }
                        : it
                  )
               )
               resolve({
                  file: item.file,
                  success: ok,
                  status: xhr.status,
                  responseText: xhr.responseText
               })
            }
            xhr.onerror = () => {
               setItems((prev) =>
                  prev.map((it) =>
                     it.id === item.id
                        ? { ...it, state: 'error', xhr: undefined, error: 'Network error' }
                        : it
                  )
               )
               resolve({ file: item.file, success: false, error: 'Network error' })
            }
            xhr.onabort = () => {
               setItems((prev) =>
                  prev.map((it) =>
                     it.id === item.id ? { ...it, state: 'canceled', xhr: undefined } : it
                  )
               )
               resolve({ file: item.file, success: false, error: 'Aborted' })
            }
            setItems((prev) =>
               prev.map((it) => (it.id === item.id ? { ...it, state: 'uploading', xhr } : it))
            )
            xhr.send(fd)
         })
      },
      [extraFields, fieldName, uploadUrl]
   )

   const uploadAll = async () => {
      const queued = items.filter((it) => it.state === 'queued')
      for (const it of queued) {
         // eslint-disable-next-line no-await-in-loop
         await uploadOne(it)
      }
   }

   const cancelUpload = (id: string) => items.find((x) => x.id === id)?.xhr?.abort()
   const removeItem = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id))
   const reset = () => setItems([])
   const hasQueued = useMemo(() => items.some((i) => i.state === 'queued'), [items])

   return {
      // state
      inputRef,
      dragActive,
      items,
      hasQueued,
      // config
      accept,
      maxSizeMB,
      multiple,
      // handlers
      onBrowseClick,
      onInputChange,
      onDrop,
      onDragOver,
      onDragLeave,
      addFiles,
      uploadAll,
      cancelUpload,
      removeItem,
      reset
   } as const
}
