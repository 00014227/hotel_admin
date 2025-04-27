'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { setUser, setUserTabel } from './lib/features/auth/auth.slice'
import { supabase } from './lib/supabaseClient'

export default function GetInitialState({ children }) {
  const dispatch = useDispatch()
  const { user, userTable } = useSelector((state) => state.auth)
  const path = usePathname()
  const router = useRouter()

  useEffect(() => {
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.slice(8, 28)

    const authRaw = localStorage.getItem(`user-auth-${sbUrl}`)
    const auth = authRaw && authRaw !== 'undefined' ? JSON.parse(authRaw) : null

    const tableRaw = localStorage.getItem(`user-table-${sbUrl}`)
    const table = tableRaw && tableRaw !== 'undefined' ? JSON.parse(tableRaw) : null

    // Sync local storage with Redux
    if (auth?.session?.access_token && !user) {
      dispatch(setUser(auth))
    }

    if (table?.email && !userTable) {
      dispatch(setUserTabel(table))
    }

    // Route protection
    const protectRoutes = async () => {
      const { data } = await supabase.auth.getSession()
      const isAuthenticated = !!data.session

      if (!isAuthenticated) {
        router.push('/auth')
      } else if (path === '/' || path.includes('/auth')) {
        router.push('/dashboard')
      }
    }

    protectRoutes()
  }, [dispatch, path, router, user, userTable])

  return <>{children}</>
}
