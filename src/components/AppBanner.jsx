'use client';

import { useAuth } from '@/auth';
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function AppBanner() {
    const { auth } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        auth.logoutUser();
        handleMenuClose();
    };

    return (
        <div className="w-full bg-fuchsia-500 py-2 px-4 flex items-center justify-between">
            <Link href="/" className="text-3xl w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                🏠︎
            </Link>

            <div className="relative">
                <button 
                    onClick={handleProfileMenuOpen}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow cursor-pointer"
                >
                    {auth.loggedIn ? (
                        <span className="font-bold text-fuchsia-500">{auth.getUserInitials()}</span>
                    ) : (
                        <Image
                            src="/profile_icon.png"
                            alt="Profile"
                            width={24}
                            height={24}
                        />
                    )}
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-12 bg-white shadow-lg rounded p-2 z-10 min-w-[150px]">
                        {auth.loggedIn ? (
                            <>
                                <div className="px-4 py-2 border-b text-sm">
                                    {auth.user?.firstName} {auth.user?.lastName}
                                </div>
                                <button 
                                    onClick={handleLogout} 
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    href="/register" 
                                    onClick={handleMenuClose}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Create Account
                                </Link>
                                <Link 
                                    href="/login" 
                                    onClick={handleMenuClose}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}