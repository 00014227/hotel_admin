import { setUser } from '@/app/lib/features/auth/auth.slice'
import { supabase } from '@/app/lib/supabaseClient'
import {useState} from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

export default function useSignUp() {
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.slice(8, 28)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)
    const dispatch = useDispatch()
    const signUp = async (email, password) => {
        console.log('wgwegwe',email, password)
        setIsLoading(false)
        setError(null)
        try {
            setIsLoading(true)
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error?.code === 'user_already_exists') {
                toast.error("User already exists")
                setError(err.message)
                localStorage.removeItem(`user-table-${sbUrl}`)
                localStorage.removeItem(`user-auth-${sbUrl}`)
                return
            }
            if (error) {
                toast.error(error.message, { theme: 'dark' })
                setError(error.message)
                localStorage.removeItem(`user-table-${sbUrl}`)
                localStorage.removeItem(`user-auth-${sbUrl}`)
                return
            };
           
            if (data?.user) {
                localStorage.setItem(`user-auth-${sbUrl}`, JSON.stringify(data))
                toast.success("User created successfully")
                dispatch(setUser(data));

            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message)
            localStorage.removeItem(`user-table-${sbUrl}`)
            localStorage.removeItem(`user-auth-${sbUrl}`)
        } finally {
            setIsLoading(false);
        }
    };

  return {signUp, isLoading, error, data}
}
