import { useState } from 'react'

export const usePasswordVisibility = (initialState: boolean = false) => {
   const [show, setShow] = useState(initialState)

   const toggle = () => setShow(!show)

   return { show, toggle }
}
