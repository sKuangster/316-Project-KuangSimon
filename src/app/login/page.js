"use client";

import AppBanner from "@/components/AppBanner";
import Copyright from "@/components/Copyright";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/auth";

export default function Login() {
  const { auth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    await auth.loginUser(email, password);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppBanner />

      <div className="flex flex-col flex-grow items-center justify-center bg-orange-100">
        <div className="relative m-3 w-[120px] h-[120px]">
          <Image
            src="/lock.png"
            alt="lock"
            fill
            className="object-contain"
          />
        </div>

        <div className="text-4xl text-gray-600 mb-4">
          Sign In
        </div>

        <input
          className="p-3 rounded border bg-purple-200 w-[500px] h-[50px] m-5"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="p-3 rounded border bg-purple-200 w-[500px] h-[50px] m-5"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signIn}
          className="rounded-lg bg-black w-[500px] h-[40px] m-8 text-white"
        >
          Sign in
        </button>

        {auth.errorMessage && (
          <div className="text-red-600 mt-2">
            {auth.errorMessage}
          </div>
        )}

        <div className="text-red mt-4">
          Don't have an account? <Link href="/register">Sign up</Link>
        </div>
      </div>

      <div className="bg-orange-100 mt-auto">
        <Copyright />
      </div>
    </div>
  );
}
