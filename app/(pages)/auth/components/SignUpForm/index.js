// import { useAuth } from '@/app/hooks/auth/useAuth';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import useUpdateUserTable from '@/app/hooks/auth/useUpdateUserTable/useUpdateUserTable';
import useSignUp from '@/app/hooks/auth/useSignUp/useSignUp';


function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [active, setActive] = useState(false)
    const { signUp, data, isLoading, error } = useSignUp();
    const { userTable, user } = useSelector((store) => store.auth)
    const router = useRouter()
    const {
        isLoading: tableIsLoading,
        updateUserTable,
        error: tableError,
      } = useUpdateUserTable()


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords are not the same')
            return
        }

        if (!email || !password) {
            toast.error("All inputs must be field")
            return
        }

        if (password.length < 6) {
            toast.error("The length of password must be 6", { theme: 'light' })
            return
        }

        setActive(true)
        await signUp(email, password)
    }

    useEffect(() => {
        if (user?.user && active && email && !error && !isLoading && data) {

            const fetch = async () => {
                await updateUserTable({
                    id: user.user.id,
                    email: user.user.email
                })
            }
            fetch()
            setEmail('')
            setPassword('')
            setConfirmPassword('')

        }
    }, [user, active, email, isLoading, error, data, updateUserTable])

    useEffect(() => {
        if (user && userTable && active) {
          setTimeout(() => router.push('/'), 250)
          setActive(false)
        }
      }, [active, router, user, userTable])

      useEffect(() => {
        if (error || tableError) {
          setActive(false)
        }
      }, [error, tableError])

    return (

        <form
            className="flex flex-col max-w-2xl w-full rounded-lg shadow-xl border-t"
            onSubmit={(e) => e.preventDefault()}
        >
            <div className="border-b border-gray-300 py-4">
                <h1 className="text-center text-2xl text-gray-800">Sign Up</h1>
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

                <input
                    className="w-full p-4 border-2 rounded-xl"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    className="w-full p-4 bg-blue-500 text-white font-bold text-lg hover:bg-blue-700 rounded-xl"
                    onClick={handleSubmit}
                    disabled={isLoading || tableIsLoading}
                >
                    {isLoading ? 'Processing...' : 'Sign Up'}
                </button>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    className="w-full flex items-center text-center border-2 border-black p-4 font-bold text-lg rounded-xl hover:bg-gray-200"
                    // onClick={signInWithGoogle}
                    disabled={isLoading}
                >
                    <FcGoogle />
                    <span className="mx-auto">With Google</span>
                </button>
            </div>
        </form>
    );
}

export default SignUpForm;