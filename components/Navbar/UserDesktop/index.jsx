import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Dropdown from './Dropdown';


const NavbarUserDesktop = ({ userAuth }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    return (
        <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <PopoverTrigger asChild>
                <div className='flex border border-gray-500 justify-between w-auto gap-5 p-2 items-center rounded-3xl hover:bg-gray-200'>
                    {userAuth && userAuth.user.email ? (
                        <span className='flex size-8 select-none  justify-center items-center uppercase bg-red-500 rounded-full text-lg text-white font-bold'>
                            {userAuth.user.email.slice(0, 1)}
                        </span>) : (
                        <FaUser />
                    )}

                    <GiHamburgerMenu />

                </div>
            </PopoverTrigger>
            <Dropdown/> 
        </Popover>
    );
};

export default NavbarUserDesktop;