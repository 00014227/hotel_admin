import { useAuth } from '@/app/hooks/auth/useAuth';
import useGetUserTable from '@/app/hooks/auth/useGetUserTable/useGetUserTable';
import { setUser, setUserTabel } from '@/app/lib/features/auth/auth.slice';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const LogInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, signInWithGoogle, loading, error } = useAuth();
    const [active, setActive] = useState(false)
    const { userTable, user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const router = useRouter()
    const {
        isLoading: tableIsLoading,
        getUserTable,
        error: tableError,
      } = useGetUserTable()

      const handleSubmit = async (e) => {
        e.preventDefault()
        if (password.length < 6) {
          toast.error(t("Parol 6 ta belgidan kam bo'lmasligi kerak"), {
            theme: 'dark',
          })
          return
        }
    
        setActive(true)
        await getUserTable({ email })
      }

      useEffect(() => {
        if (userTable && active ) {
          const fetch = async () =>
            await signIn({email: userTable?.email, password })
          fetch()
          
          setEmail('')
          setPassword('')
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [userTable, active])

      useEffect(() => {
        if (userTable && user && active) {
          router.push('/dashboard')
          setActive(false)
        }
      }, [active, router, user, userTable])

      useEffect(() => {
        if (error || tableError) {
          setActive(false)
          localStorage.clear()
          dispatch(setUser(null))
          dispatch(setUserTabel(null))
        }
      }, [error, tableError, dispatch])
    return (
        <form
            className="flex flex-col max-w-2xl w-full rounded-lg shadow-xl border-t"
            onSubmit={(e) => e.preventDefault()}
        >
            <div className="border-b border-gray-300 py-4">
                <h1 className="text-center text-2xl text-gray-800">Log In</h1>
            </div>
            <div className="space-y-5 p-8">
                <h2 className="text-gray-800 text-3xl">Welcome to our platform</h2>
            

                <input
                    className="w-full p-4 border-2 rounded-xl"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full p-4 border-2 rounded-xl"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full p-4 bg-red-500 text-white font-bold text-lg hover:bg-red-700 rounded-xl"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Log In'}
                </button>

      
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    className="w-full flex items-center text-center border-2 border-black p-4 font-bold text-lg rounded-xl hover:bg-gray-200"
                    onClick={signInWithGoogle}
                    disabled={loading}
                >
                    <FcGoogle />
                    <span className="mx-auto">With Google</span>
                </button>
            </div>
        </form>
    );
};

export default LogInForm;