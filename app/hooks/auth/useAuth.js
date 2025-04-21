import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoading, setUser, setError, clearAuthState } from '../../lib/features/auth/auth.slice';

export const useAuth = () => {
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.slice(8, 28)
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const router = useRouter()
    
    const signIn = async ({email, password}) => {
        dispatch(setLoading(false))
        dispatch(setError(null))

        if (!email || !password) {
            toast.error("All inputs must be field")
            return
        }

        if (password.length < 6) {
            toast.error("The length of password must be 6", { theme: 'light' })
            return
        }


        try {
            dispatch(setLoading(true));
            const { data, error } = await supabase.auth.signInWithPassword({ email, password, });
            console.log(data, error);
            if (error?.code === "invalid_credentials") {
                toast.error("The login or password incorrect")
            };

            if (error) {
                toast.error(error.message)
                return
            }

            if (data?.user) {
                dispatch(setUser(data));
                localStorage.setItem(`user-auth-${sbUrl}`, JSON.stringify(data))    
                router.push('/');
            }

            

        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signUp = async (email, password) => {
        dispatch(setLoading(true));
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });

            if (error?.code === 'user_already_exists') {
                toast.error("User already exists")
                dispatch(setError(err.message))
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
           
            if (data?.user && data?.session) {
                localStorage.setItem(`user-auth-${sbUrl}`, JSON.stringify(data))
                toast.success("User created successfully")
                dispatch(setUser(data.user));

            }
        } catch (err) {
            dispatch(setError(err.message));
            toast.error(err.message)
            localStorage.removeItem(`user-table-${sbUrl}`)
            localStorage.removeItem(`user-auth-${sbUrl}`)
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signOut = async () => {
        dispatch(setLoading(true));
        try {
            await supabase.auth.signOut();
            dispatch(clearAuthState());
            localStorage.removeItem(`user-table-${sbUrl}`)
            localStorage.removeItem(`user-auth-${sbUrl}`)
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
            if (error) throw error;
        } catch (err) {
            dispatch(setError(err.message));
        }
    };

    return {
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
    };
};
