import { setUser } from '@/app/lib/features/auth/auth.slice'
import {useState} from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

export default function useUpdateUserTable() {
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.slice(8, 28)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)
    const dispatch = useDispatch()

    const updateUserTable = async ({id, email}) => {
        setIsLoading(false)
        setError(null)

        if (!id || !email) {
            setError('Email not provided')
            toast.error('Email not provided')
            return
        }

        try {
            setIsLoading(true)
      
            const { data, error } = await supabase
              .from('user')
              .update({ email })
              .eq('guid', id)
              .select('*')
      
            if (error) {
              setError(error.message)
              toast.error(error.message)
              localStorage.removeItem(`user-table-${sbUrl}`)
              localStorage.removeItem(`user-auth-${sbUrl}`)
              return
            }
            if (data) {
              dispatch(setUser(data[0]))
              localStorage.setItem(`user-table-${sbUrl}`, JSON.stringify(data[0]))
              setData(data)
            }
          } catch (error) {
            setError(error.message)
            toast.error(error.message, { theme: 'dark' })
            localStorage.removeItem(`user-table-${sbUrl}`)
            localStorage.removeItem(`user-auth-${sbUrl}`)
          } finally {
            setIsLoading(false)
          } 
    }
    return { updateUserTable, isLoading, error, data }

}
