import Link from "next/link";
import { useSelector } from "react-redux";
import Gutter from "../Gutter";

export default function Navbar() {
    // const { user } = useSelector((state) => state.auth)
    // console.log(user?.user)
    return (
        <div className="w-full bg-white p-4 shadow-md ">
            <Gutter>
                <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-lg font-bold">Booking.uz</p>
                    <div className="flex space-x-4">
                        <button className=" text-gray-600 px-8 py-2 rounded-3xl hover:bg-gray-200">
                            Register Hotel
                        </button>

                        {/* {user?.user.email ? (
                            <NavbarUserDesktop userAuth={user} />

                        ) : (
                            <>
                                <Link href={'/auth?tab=login'} className="bg-red-500 text-white px-8 py-2 rounded-3xl hover:bg-red-800">
                                    Sign In
                                </Link>
                                <Link href={'/auth?tab=signup'} className=" text-gray-600 px-8 py-2 rounded-3xl border border-gray-600 hover:bg-gray-200">
                                    Sign Up
                                </Link>
                            </>
                        )} */}

                    </div>
                </div>
            </Gutter>
        </div>
    )
}