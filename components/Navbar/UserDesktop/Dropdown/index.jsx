import { useAuth } from '@/app/hooks/auth/useAuth';
import { PopoverContent } from '@/components/ui/popover';
import Link from 'next/link';
import React from 'react';
import { MdLogout } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { useDispatch } from 'react-redux';

const Dropdown = () => {
    const dispatch = useDispatch();
    const {signOut} = useAuth()
    return (
        <PopoverContent>
            <Link href={''} className="flex h-full items-center gap-2 rounded p-1 hover:bg-gray-100 w-full">
                <MdOutlineMessage />
                Messages</Link>
            <Link href={''} className="flex h-full items-center gap-2 rounded p-1 hover:bg-gray-100 w-full">
                <VscAccount />

                Account</Link>

            <div onClick={signOut} className="flex items-center h-full gap-2 rounded p-1 hover:bg-gray-100 w-full">
                <MdLogout />
                Log out
            </div>
        </PopoverContent>
    );
};

export default Dropdown;