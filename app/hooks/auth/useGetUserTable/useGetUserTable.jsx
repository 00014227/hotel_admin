import { setUserTabel } from '@/app/lib/features/auth/auth.slice'
import { supabase } from '@/app/lib/supabaseClient'
import {useState, useTranslation} from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

export default function useGetUserTable() {
const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.slice(8, 28)
const [error, setError] = useState(null)
const [isLoading, setIsLoading] = useState(false)
const [data, setData] = useState(null)
const dispatch = useDispatch()

const getUserTable = async({email}) => {
    setIsLoading(false)
    setError(null)

    if (!email) {
        toast.error('Email not provided')
        return
    }

    try {
        setIsLoading(true)
        const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('email', email)

      if (error) {
        setError(error.message)
        toast.error(error.message)
        return
      }

      if (!data[0]) {
        setError('email or password incorrect')
        toast.error('email or password incorrect')
        return
      }

      if (data && data[0]) {
        dispatch(setUserTabel(data[0]))
        localStorage.setItem(`user-table-${sbUrl}`, JSON.stringify(data[0]))
        setData(data)
      }
    } catch (error) {
        setError(error.message)
        toast(error.message)
    } finally {
        setIsLoading(false)
    }
}
    return {getUserTable, isLoading, error, data}
}
