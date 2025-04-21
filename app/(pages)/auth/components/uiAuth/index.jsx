import React from 'react'
import { useAuth } from "@/app/hooks/auth/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LogInForm from '../LogInForm';
import SignUpForm from '../SignUpForm';

export default function UIAuth() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [currentTab, setCurrentTab] = useState('login');

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'signup' || tab === 'login') {
            setCurrentTab(tab)
        }
    }, [searchParams])

    const handleTabChange = (tab) => {
        setCurrentTab(tab)
        router.push(`/auth?tab=${tab}`)
    }
  return (
    <main className="flex justify-center items-center h-auto py-14">
    <div className="flex flex-col items-center w-1/3 rounded-md shadow-lg border">
        {/* Tabs */}
        <div className="flex w-full">
            <button
                className={`w-1/2 py-2 text-lg font-bold ${currentTab === 'login'
                        ? "bg-red-500 text-white border-b-2 border-red-700"
                        : "bg-gray-100 text-gray-700"
                    } rounded-t-md`}
                onClick={() => handleTabChange('login')}
            >
                Sign In
            </button>
            <button
                className={`w-1/2 py-2 text-lg font-bold ${currentTab === 'signup'
                        ? "bg-red-500 text-white border-b-2 border-red-700"
                        : "bg-gray-100 text-gray-700"
                    } rounded-t-md`}
                onClick={() => handleTabChange('signup')}
            >
                Sign Up
            </button>
        </div>

        {/* Form */}
        <div className="w-full p-6">
            {currentTab === 'login' && <LogInForm />}
            {currentTab === 'signup' && <SignUpForm />}
        </div>
    </div>
</main>
  )
}
