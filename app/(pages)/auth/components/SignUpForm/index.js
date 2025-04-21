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
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState("")
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
  className="flex flex-col max-w-md w-full rounded-lg shadow border"
  onSubmit={(e) => e.preventDefault()}
>
  <div className="border-b px-4 py-3">
    <h1 className="text-center text-xl font-semibold text-gray-800">Sign Up</h1>
  </div>

  <div className="space-y-3 p-4">
    <h2 className="text-lg text-gray-700 text-center">
      Sign in to manage your listing
    </h2>

    <input
      className="w-full p-2 border rounded-md text-sm"
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      className="w-full p-2 border rounded-md text-sm"
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <input
      className="w-full p-2 border rounded-md text-sm"
      type="password"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
    <input
      className="w-full p-2 border rounded-md text-sm"
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <input
      className="w-full p-2 border rounded-md text-sm"
      type="text"
      placeholder="Surname"
      value={surname}
      onChange={(e) => setSurname(e.target.value)}
    />
    <input
      className="w-full p-2 border rounded-md text-sm"
      type="text"
      placeholder="Phone"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />

    <button
      className="w-full p-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
      onClick={handleSubmit}
      disabled={isLoading || tableIsLoading}
    >
      {isLoading ? 'Processing...' : 'Sign Up'}
    </button>

    <div className="flex items-center text-sm text-gray-400">
      <div className="flex-grow border-t"></div>
      <span className="px-2">OR</span>
      <div className="flex-grow border-t"></div>
    </div>

    <button
      className="w-full flex items-center justify-center gap-2 border p-2 text-sm rounded-md hover:bg-gray-100"
      disabled={isLoading}
    >
      <FcGoogle className="text-lg" />
      Sign up with Google
    </button>
  </div>
</form>

    );
}

export default SignUpForm;