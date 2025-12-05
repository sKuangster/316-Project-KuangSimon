'use client';

import { useAuth } from '@/auth';
import Image from "next/image";
import Link from "next/link";
import AppBanner from "../components/AppBanner";

export default function WelcomeScreen() {
  const { auth } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-white">
      <AppBanner />

      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        <div className="text-7xl text-black">The Playlister</div>

        <div className="relative w-[250px] h-[250px]">
          <Image
            src="/music_notes.png"
            alt="music notes"
            fill
            className="object-contain"
          />
        </div>

        <div className="flex justify-center gap-4">
          <Link className="text-black px-4 py-2 border rounded" href="/playlists">
            Continue As Guest
          </Link>
          <Link className="text-black px-4 py-2 border rounded" href="/login">
            Login
          </Link>
          <Link className="text-black px-4 py-2 border rounded" href="/register">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}