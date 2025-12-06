"use client";

import AppBanner from "@/components/AppBanner";
import Copyright from "@/components/Copyright";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/auth";

export default function Login() {
  const { auth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    await auth.loginUser(email, password);
  }

  const isFormValid = email && password;

  return (
    <div className="flex flex-col min-h-screen">
      <AppBanner />

      <div className="flex flex-col flex-grow items-center justify-center bg-orange-100">
        <div className="relative m-3 w-[120px] h-[120px]">
          <img
            src="/lock.png"
            alt="lock"
            fill
            className="object-contain"
          />
        </div>

        <div className="text-4xl text-gray-600 mb-4">
          Sign In
        </div>

        <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
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
            type="submit"
            disabled={!isFormValid}
            className={`rounded-lg w-[500px] h-[40px] m-8 text-white ${
              isFormValid 
                ? 'bg-black hover:bg-gray-800' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Sign in
          </button>
        </form>

        {auth.errorMessage && (
          <div className="text-red-600 mt-2 max-w-[500px] text-center bg-red-50 p-3 rounded border border-red-300">
            {auth.errorMessage}
          </div>
        )}

        <div className="text-red mt-4">
          Don't have an account? <Link href="/register" className="underline">Sign up</Link>
        </div>
      </div>

      <div className="bg-orange-100 mt-auto">
        <Copyright />
      </div>
    </div>
  );
}